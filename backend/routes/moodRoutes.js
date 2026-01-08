const express = require('express');
const router = express.Router();
const User = require('../models/user');
const cors = require("cors");
const { verifyToken } = require('../middleware/authMiddleware');

// Handle OPTIONS preflight request for CORS
router.options('/', cors());

// Helper: compute streak (consecutive days up to today with entries)
function computeStreak(entries) {
  if (!entries || entries.length === 0) return 0;
  // Build a set of dates (YYYY-MM-DD)
  const set = new Set(entries.map(e => new Date(e.date).toISOString().slice(0,10)));
  let day = new Date();
  let streak = 0;
  while (true) {
    const key = day.toISOString().slice(0,10);
    if (set.has(key)) {
      streak++;
      day.setDate(day.getDate()-1);
    } else break;
  }
  return streak;
}

// GET /api/mood - return user's mood history and summary
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const moodHistory = (user.moodHistory || []).map(m => ({ ...m }));

    // Weekly data: last 7 days
    const today = new Date();
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0,10);
      const entry = (user.moodHistory || []).find(e => new Date(e.date).toISOString().slice(0,10) === key);
      weekly.push({ date: key, mood: entry ? entry.mood : null });
    }

    // Monthly summary (last 30 days)
    const since = new Date(); since.setDate(since.getDate() - 29);
    const recent = (user.moodHistory || []).filter(e => new Date(e.date) >= since);
    const avg = recent.length ? (recent.reduce((s,a)=>s+(a.mood||0),0)/recent.length) : null;

    const summary = {
      averageMood: avg ? Number(avg.toFixed(1)) : null,
      totalEntries: recent.length,
      streak: computeStreak(user.moodHistory || []),
    };

    res.json({ moodHistory: moodHistory.sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime()), weekly, summary });
  } catch (err) {
    console.error('Get mood error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/mood - Add a mood entry for the authenticated user
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mood, note, date } = req.body;
    if (!mood) return res.status(400).json({ message: 'mood required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const entry = { mood, note: note || '', date: date ? new Date(date) : new Date() };

    user.moodHistory.push(entry);
    await user.save();

    res.json({ message: 'Mood saved', entry, moodHistory: user.moodHistory });
  } catch (err) {
    console.error('Save mood error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
