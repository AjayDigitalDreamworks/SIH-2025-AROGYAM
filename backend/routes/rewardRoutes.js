const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { verifyToken } = require("../middleware/authMiddleware");

const STORE_ITEMS = [
  { id: "premium-avatar", icon: "🧑‍🎨", title: "Premium Avatar", cost: 100 },
  { id: "custom-theme", icon: "🎨", title: "Custom Dashboard Theme", cost: 150 },
  { id: "profile-badge", icon: "🏷️", title: "Profile Badge", cost: 200 },
];

const ACHIEVEMENTS = [
  { id: "first-activity", icon: "🏅", title: "First Activity", desc: "Completed your first activity" },
  { id: "streak-7", icon: "🔥", title: "7 Day Streak", desc: "Maintained streak for 7 days" },
  { id: "quiz-master", icon: "📚", title: "Quiz Master", desc: "Completed 10 quizzes" },
  { id: "activity-explorer", icon: "🎮", title: "Activity Explorer", desc: "Used all core trackers" },
  { id: "points-500", icon: "⭐", title: "500 Points", desc: "Earned 500 total points" },
  { id: "streak-30", icon: "🌟", title: "30 Day Streak", desc: "Maintained streak for 30 days" },
];

function toDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function scoreToPoints(score) {
  const safe = Number(score) || 0;
  return Math.max(10, Math.round(safe / 5));
}

function computeMoodStreak(entries = []) {
  if (!Array.isArray(entries) || entries.length === 0) return 0;

  const dateSet = new Set();
  entries.forEach((entry) => {
    const date = toDate(entry.date);
    if (!date) return;
    dateSet.add(date.toISOString().slice(0, 10));
  });

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!dateSet.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function buildPointEvents(user) {
  const events = [];

  (user.moodHistory || []).forEach((entry) => {
    const date = toDate(entry.date);
    if (date) events.push({ date, points: 10 });
  });

  (user.sleepHistory || []).forEach((entry) => {
    const date = toDate(entry.date);
    if (date) events.push({ date, points: 8 });
  });

  (user.quizScores || []).forEach((entry) => {
    const date = toDate(entry.date);
    if (date) events.push({ date, points: scoreToPoints(entry.score) });
  });

  return events;
}

function buildRewardPayload(user) {
  const pointEvents = buildPointEvents(user);
  const totalEarnedPoints = pointEvents.reduce((sum, event) => sum + event.points, 0);
  const spentPoints = Math.max(0, Number(user.spentRewardPoints) || 0);
  const availablePoints = Math.max(0, totalEarnedPoints - spentPoints);

  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - 6);
  const thisWeekPoints = pointEvents
    .filter((event) => event.date >= weekStart)
    .reduce((sum, event) => sum + event.points, 0);

  const moodCount = (user.moodHistory || []).length;
  const sleepCount = (user.sleepHistory || []).length;
  const quizCount = (user.quizScores || []).length;
  const activitiesCompleted = moodCount + sleepCount + quizCount;
  const currentStreakDays = computeMoodStreak(user.moodHistory || []);

  const categoriesUsed = [moodCount > 0, sleepCount > 0, quizCount > 0].filter(Boolean).length;

  const unlockedLookup = {
    "first-activity": activitiesCompleted > 0,
    "streak-7": currentStreakDays >= 7,
    "quiz-master": quizCount >= 10,
    "activity-explorer": categoriesUsed >= 3,
    "points-500": totalEarnedPoints >= 500,
    "streak-30": currentStreakDays >= 30,
  };

  const achievements = ACHIEVEMENTS.map((item) => ({
    ...item,
    unlocked: Boolean(unlockedLookup[item.id]),
  }));
  const achievementsUnlocked = achievements.filter((item) => item.unlocked).length;

  const redeemedRewards = Array.isArray(user.redeemedRewards) ? user.redeemedRewards : [];
  const redeemedMap = new Map();
  redeemedRewards.forEach((item) => {
    if (!item || !item.rewardId) return;
    redeemedMap.set(item.rewardId, item);
  });

  const store = STORE_ITEMS.map((item) => {
    const redeemed = redeemedMap.get(item.id);
    return {
      ...item,
      redeemed: Boolean(redeemed),
      redeemedAt: redeemed ? redeemed.redeemedAt : null,
    };
  });

  return {
    summary: {
      totalEarnedPoints,
      spentPoints,
      availablePoints,
      totalPoints: availablePoints,
      thisWeekPoints,
      currentStreakDays,
      activitiesCompleted,
      achievementsUnlocked,
      achievementsTotal: achievements.length,
    },
    achievements,
    store,
  };
}

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "moodHistory sleepHistory quizScores spentRewardPoints redeemedRewards"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(buildRewardPayload(user));
  } catch (err) {
    console.error("Error fetching rewards", err);
    return res.status(500).json({ message: "Error fetching rewards", error: err.message });
  }
});

router.post("/redeem", verifyToken, async (req, res) => {
  try {
    const { rewardId } = req.body || {};
    if (!rewardId) {
      return res.status(400).json({ message: "rewardId is required" });
    }

    const selected = STORE_ITEMS.find((item) => item.id === rewardId);
    if (!selected) {
      return res.status(404).json({ message: "Reward item not found" });
    }

    const user = await User.findById(req.user.userId).select(
      "moodHistory sleepHistory quizScores spentRewardPoints redeemedRewards"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const redeemedRewards = Array.isArray(user.redeemedRewards) ? user.redeemedRewards : [];
    const alreadyRedeemed = redeemedRewards.some((item) => item.rewardId === rewardId);
    if (alreadyRedeemed) {
      return res.status(409).json({ message: "Reward already redeemed" });
    }

    const beforeRedeem = buildRewardPayload(user);
    if (beforeRedeem.summary.availablePoints < selected.cost) {
      return res.status(400).json({ message: "Not enough reward points" });
    }

    user.redeemedRewards.push({
      rewardId: selected.id,
      title: selected.title,
      cost: selected.cost,
      redeemedAt: new Date(),
    });
    user.spentRewardPoints = Math.max(0, Number(user.spentRewardPoints) || 0) + selected.cost;
    await user.save();

    const payload = buildRewardPayload(user);
    return res.json({
      message: `${selected.title} redeemed successfully`,
      ...payload,
    });
  } catch (err) {
    console.error("Error redeeming reward", err);
    return res.status(500).json({ message: "Error redeeming reward", error: err.message });
  }
});

module.exports = router;
