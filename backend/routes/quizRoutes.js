const express = require('express');
const router = express.Router();
const User = require('../models/user');
const cors = require("cors");

router.options('/', cors());



// POST /api/quiz - Add a quiz score to the current user
router.post('/', async (req, res) => {
  try {
    const { userId, score, quiz_type, date } = req.body;
    if (!userId || score === undefined || !quiz_type) {
      return res.status(400).json({ message: 'userId, score, and quiz_type are required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.quizScores.push({ score, quiz_type, date });
    await user.save();
    res.status(200).json({ message: 'Quiz score added', quizScores: user.quizScores });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;