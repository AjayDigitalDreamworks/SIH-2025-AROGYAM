const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { verifyToken } = require('../middleware/authMiddleware');

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
