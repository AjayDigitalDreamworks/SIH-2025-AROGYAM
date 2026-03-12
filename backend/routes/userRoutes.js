const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { verifyToken } = require('../middleware/authMiddleware');

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Helper to compute a simple progress metric for display
function computeProgress(user) {
  // Use latest quiz score if available (0-100)
  if (user.quizScores && user.quizScores.length > 0) {
    const latest = user.quizScores[user.quizScores.length - 1];
    return Math.max(0, Math.min(100, latest.score));
  }

  // Otherwise use latest mood scaled to 0-100
  if (user.moodHistory && user.moodHistory.length > 0) {
    const latestMood = user.moodHistory[user.moodHistory.length - 1].mood || 3;
    return Math.round((latestMood / 5) * 100);
  }

  // Fallback
  return 0;
}

function getLatestByDate(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}

function computeWellbeing(user, latestMood, latestSleep, latestQuiz) {
  if (typeof user.wellbeingScore === 'number') {
    return clamp(Math.round(user.wellbeingScore), 0, 100);
  }

  const moodScore = latestMood ? Number(latestMood.mood || 0) * 20 : 0;
  const sleepScore = latestSleep ? clamp((Number(latestSleep.hours || 0) / 8) * 100, 0, 100) : 0;
  const quizScore = latestQuiz ? Number(latestQuiz.score || 0) : 0;

  return Math.round(moodScore * 0.35 + sleepScore * 0.25 + quizScore * 0.4);
}

function computeAverages(moodHistory, sleepHistory, quizScores, attendanceHistory, academicScores) {
  const avgMood = moodHistory.length
    ? moodHistory.reduce((sum, entry) => sum + Number(entry.mood || 0), 0) / moodHistory.length
    : 0;
  const avgSleep = sleepHistory.length
    ? sleepHistory.reduce((sum, entry) => sum + Number(entry.hours || 0), 0) / sleepHistory.length
    : 0;
  const avgQuiz = quizScores.length
    ? quizScores.reduce((sum, entry) => sum + Number(entry.score || 0), 0) / quizScores.length
    : 0;
  const avgAttendance = attendanceHistory.length
    ? attendanceHistory.reduce((sum, entry) => sum + Number(entry.percent || 0), 0) / attendanceHistory.length
    : 0;
  const avgAcademic = academicScores.length
    ? academicScores.reduce((sum, entry) => sum + Number(entry.score || 0), 0) / academicScores.length
    : 0;

  return {
    avgMood: Number(avgMood.toFixed(1)),
    avgSleep: Number(avgSleep.toFixed(1)),
    avgQuiz: Math.round(avgQuiz),
    avgAttendance: Math.round(avgAttendance),
    avgAcademic: Math.round(avgAcademic)
  };
}

function buildActivityTrack(moodHistory, sleepHistory, quizScores, attendanceHistory, academicScores, limit = 7) {
  const byDate = new Map();

  const addEntry = (dateValue, key, value) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return;
    const dayKey = date.toISOString().split('T')[0];
    const existing = byDate.get(dayKey) || { date: dayKey };
    byDate.set(dayKey, { ...existing, [key]: value });
  };

  moodHistory.forEach((entry) => addEntry(entry.date, 'mood', entry.mood));
  sleepHistory.forEach((entry) => addEntry(entry.date, 'sleep', entry.hours));
  quizScores.forEach((entry) => addEntry(entry.date, 'quiz', entry.score));
  attendanceHistory.forEach((entry) => addEntry(entry.date, 'attendance', entry.percent));
  academicScores.forEach((entry) => addEntry(entry.date, 'academic', entry.score));

  return Array.from(byDate.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// GET /users - list users
// Note: temporarily public for development (no auth required)
router.get('/', async (req, res) => {
  console.log(`GET /users requested from ${req.ip}`);
  try {
    const users = await User.find().select('-password -__v'); // exclude password

    const payload = users.map(u => ({
      _id: u._id,
      fullName: u.fullName,
      email: u.email,
      username: u.username,
      avatar: u.avatar,
      university: u.university,
      yearOfStudy: u.yearOfStudy,
      progress: computeProgress(u)
    }));

    res.json(payload);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// GET /users/analytics-report - analytics report for current user (protected)
router.get('/analytics-report', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)
      .select('-password -__v')
      .populate({ path: 'appointments' });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const moodHistory = Array.isArray(user.moodHistory) ? user.moodHistory : [];
    const sleepHistory = Array.isArray(user.sleepHistory) ? user.sleepHistory : [];
    const quizScores = Array.isArray(user.quizScores) ? user.quizScores : [];
    const attendanceHistory = Array.isArray(user.attendanceHistory) ? user.attendanceHistory : [];
    const academicScores = Array.isArray(user.academicScores) ? user.academicScores : [];

    const latestMood = getLatestByDate(moodHistory);
    const latestSleep = getLatestByDate(sleepHistory);
    const latestQuiz = getLatestByDate(quizScores);
    const latestAttendance = getLatestByDate(attendanceHistory);
    const latestAcademic = getLatestByDate(academicScores);

    const wellbeingScore = computeWellbeing(user, latestMood, latestSleep, latestQuiz);
    const averages = computeAverages(moodHistory, sleepHistory, quizScores, attendanceHistory, academicScores);
    const activityTrack = buildActivityTrack(moodHistory, sleepHistory, quizScores, attendanceHistory, academicScores);
    const upcomingAppointments = (user.appointments || []).slice(0, 5);

    res.json({
      user: {
        fullName: user.fullName,
        username: user.username,
        wellbeingScore
      },
      summary: {
        wellbeingScore,
        averages,
        latest: {
          mood: latestMood,
          sleep: latestSleep,
          quiz: latestQuiz,
          attendance: latestAttendance,
          academic: latestAcademic
        },
        counts: {
          mood: moodHistory.length,
          sleep: sleepHistory.length,
          quiz: quizScores.length,
          attendance: attendanceHistory.length,
          academic: academicScores.length
        },
        updatedAt: new Date().toISOString()
      },
      activityTrack,
      scores: {
        moodHistory: sortByDateDesc(moodHistory),
        sleepHistory: sortByDateDesc(sleepHistory),
        quizScores: sortByDateDesc(quizScores),
        attendanceHistory: sortByDateDesc(attendanceHistory),
        academicScores: sortByDateDesc(academicScores)
      },
      upcomingAppointments
    });
  } catch (err) {
    console.error('Error fetching analytics report', err);
    res.status(500).json({ message: 'Error fetching analytics report', error: err.message });
  }
});

// GET /users/dashboard - return aggregated data for current user (protected)
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)
      .select('-password -__v')
      .populate({ path: 'appointments' });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Latest mood and sleep entries
    const latestMood = user.moodHistory && user.moodHistory.length ? user.moodHistory[user.moodHistory.length - 1] : null;
    const latestSleep = user.sleepHistory && user.sleepHistory.length ? user.sleepHistory[user.sleepHistory.length - 1] : null;

    // Upcoming appointments - return next 5
    const upcomingAppointments = (user.appointments || []).slice(0, 5);

    // Recent quiz scores
    const quizScores = (user.quizScores || []).slice(-5).reverse();

    res.json({ user, latestMood, latestSleep, upcomingAppointments, quizScores });
  } catch (err) {
    console.error('Error fetching dashboard data', err);
    res.status(500).json({ message: 'Error fetching dashboard data', error: err.message });
  }
});

module.exports = router;
