const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/user");
const Counselor = require("../models/counsellor");
const Appointment = require("../models/appointment");
const Community = require("../models/community");
const CommunityPost = require("../models/comments");
const ChatMessage = require("../models/chat");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const BRANCH_COLORS = [
  "hsl(215, 65%, 55%)",
  "hsl(145, 50%, 48%)",
  "hsl(30, 85%, 58%)",
  "hsl(175, 45%, 50%)",
  "hsl(260, 50%, 60%)",
  "hsl(0, 72%, 58%)",
];

const GROUP_COLORS = [
  "bg-[hsl(var(--arogyam-sky))]",
  "bg-[hsl(var(--arogyam-lavender))]",
  "bg-[hsl(var(--arogyam-teal)/0.15)]",
  "bg-[hsl(var(--arogyam-coral)/0.15)]",
];

const TOPIC_RULES = [
  { topic: "Exam Stress", pattern: /(exam|assignment|study|result|cgpa|grade)/i },
  { topic: "Homesickness", pattern: /(home|hostel|family|lonely|roommate)/i },
  { topic: "Placement Anxiety", pattern: /(placement|internship|career|job|interview)/i },
  { topic: "Sleep Problems", pattern: /(sleep|insomnia|tired|fatigue|rest)/i },
  { topic: "Social Anxiety", pattern: /(social|friend|peer|confidence|public)/i },
];

const ensureAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

const clamp = (num, min, max) => Math.max(min, Math.min(max, num));
const round = (num) => Math.round(Number(num) || 0);

const safeDate = (value) => {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return null;
  return d;
};

const formatDateLabel = (value) => {
  const d = safeDate(value);
  if (!d) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  return `${day}-${month}`;
};

const formatTimeAgo = (value) => {
  const d = safeDate(value);
  if (!d) return "recently";
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day ago`;
};

const formatNextSession = (value) => {
  const d = safeDate(value);
  if (!d) return "To Be Scheduled";
  const now = new Date();
  const sameDate =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  if (sameDate) return `Today, ${time}`;
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  return `${weekday}, ${time}`;
};

const toYearLabel = (value) => {
  const map = {
    "1": "1st Year",
    "2": "2nd Year",
    "3": "3rd Year",
    "4": "4th Year",
  };
  return map[String(value)] || "N/A";
};

const getStudentCode = (user) => {
  if (!user) return "STU-NA";
  if (user.studentId) return user.studentId;
  const idTail = String(user._id || "").slice(-4).toUpperCase();
  return `STU-${idTail || "0000"}`;
};

const extractScoreTimeline = (user) => {
  const timeline = [];
  (user.quizScores || []).forEach((q) => {
    const d = safeDate(q.date);
    if (d) timeline.push({ date: d, score: clamp(q.score || 0, 0, 100) });
  });
  (user.moodHistory || []).forEach((m) => {
    const d = safeDate(m.date);
    if (d) timeline.push({ date: d, score: clamp((m.mood || 0) * 20, 0, 100) });
  });
  timeline.sort((a, b) => b.date.getTime() - a.date.getTime());
  return timeline;
};

const computeUserScore = (user) => {
  if (typeof user.wellbeingScore === "number") {
    return clamp(round(user.wellbeingScore), 0, 100);
  }

  const timeline = extractScoreTimeline(user);
  if (timeline.length) return clamp(round(timeline[0].score), 0, 100);

  return 0;
};

const computeProgressDelta = (user) => {
  const timeline = extractScoreTimeline(user);
  if (timeline.length < 2) return 0;
  return round(timeline[0].score - timeline[1].score);
};

const inferRiskLevel = (user, score) => {
  if (user.riskLevel) return user.riskLevel;
  if (score < 55) return "High";
  if (score < 75) return "Moderate";
  return "Low";
};

const getStudentStatus = (score, riskLevel, progressDelta) => {
  if (score >= 85) return "Excellent";
  if (riskLevel === "High" || score < 55) return "At Risk";
  if (progressDelta >= 3) return "Improving";
  return "Stable";
};

const deriveFallbackRiskFactors = (student) => {
  const factors = [];

  const latestSleep = (student.sleepHistory || []).slice(-1)[0];
  const latestMood = (student.moodHistory || []).slice(-1)[0];

  if (student.score < 60) factors.push("Academic Stress");
  if (latestSleep && Number(latestSleep.hours) < 6) factors.push("Sleep Problems");
  if (latestMood && Number(latestMood.mood) <= 2) factors.push("Emotional Distress");
  if (student.residenceType === "Hostel" && student.score < 70) factors.push("Homesickness");

  if (!factors.length) factors.push("General Anxiety");
  return factors;
};

const buildTrendData = (students, weekCount = 4) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const now = new Date();
  const overallScore = students.length
    ? round(students.reduce((sum, s) => sum + s.score, 0) / students.length)
    : 0;
  let fallback = overallScore;

  const data = [];
  for (let i = weekCount - 1; i >= 0; i -= 1) {
    const windowEnd = new Date(now.getTime() - i * 7 * oneDay);
    const windowStart = new Date(windowEnd.getTime() - 7 * oneDay);
    const weeklyScores = [];

    students.forEach((student) => {
      const timeline = extractScoreTimeline(student);
      timeline.forEach((entry) => {
        if (entry.date >= windowStart && entry.date < windowEnd) {
          weeklyScores.push(entry.score);
        }
      });
    });

    const score = weeklyScores.length
      ? round(weeklyScores.reduce((sum, value) => sum + value, 0) / weeklyScores.length)
      : fallback;

    fallback = score;
    data.push({ week: `Week ${weekCount - i}`, score });
  }

  return data;
};

const buildRiskBreakdown = (students) => {
  const counts = new Map();
  students.forEach((student) => {
    const factors = Array.isArray(student.riskFactors) && student.riskFactors.length
      ? student.riskFactors
      : deriveFallbackRiskFactors(student);

    factors.forEach((factor) => {
      counts.set(factor, (counts.get(factor) || 0) + 1);
    });
  });

  const total = students.length || 1;
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => {
      const percent = round((count / total) * 100);
      return { name, value: percent, percent };
    });
};

const mapAppointmentStatus = (status) => {
  if (status === "accepted" || status === "modified") return "Confirmed";
  if (status === "pending") return "Pending";
  if (status === "completed") return "Completed";
  return "Completed";
};

const inferMode = (appointment) => {
  if (appointment.mode) return appointment.mode;
  if (String(appointment.type || "").toLowerCase().includes("offline")) return "Offline";
  return "Online";
};

const classifyTopic = (text) => {
  for (const rule of TOPIC_RULES) {
    if (rule.pattern.test(text)) return rule.topic;
  }
  return null;
};

async function getStudentsSnapshot() {
  const users = await User.find({ role: "student" }).lean();
  return users.map((user) => {
    const score = computeUserScore(user);
    const progressDelta = computeProgressDelta(user);
    const riskLevel = inferRiskLevel(user, score);
    return {
      ...user,
      score,
      progressDelta,
      riskLevel,
      studentCode: getStudentCode(user),
      status: getStudentStatus(score, riskLevel, progressDelta),
    };
  });
}

async function getCounsellorSessionMap() {
  const activeStatuses = ["accepted", "completed", "modified"];
  const grouped = await Appointment.aggregate([
    { $match: { status: { $in: activeStatuses } } },
    { $group: { _id: "$counselorId", sessions: { $sum: 1 } } },
  ]);

  const map = new Map();
  grouped.forEach((row) => map.set(String(row._id), row.sessions));
  return map;
}

/* -------------------- Auth -------------------- */

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const payload = {
      userId: admin._id,
      role: admin.role,
      username: admin.username,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      message: "Login successful",
      token,
      user: { _id: admin._id, username: admin.username, name: admin.name },
    });
  } catch (err) {
    console.error("Admin login error", err);
    res.status(500).json({ message: "Login failed" });
  }
});

router.post("/register", verifyToken, ensureAdmin, async (req, res) => {
  const { username, password, name, email, phone, department, campus } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      department,
      campus,
    });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Admin registration error", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.get("/dashboard", verifyToken, ensureAdmin, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard", user: req.user });
});

/* -------------------- Dashboard Overview -------------------- */

router.get("/overview", verifyToken, ensureAdmin, async (_req, res) => {
  try {
    const students = await getStudentsSnapshot();
    const totalStudents = students.length;

    const lowCount = students.filter((s) => s.riskLevel === "Low").length;
    const moderateCount = students.filter((s) => s.riskLevel === "Moderate").length;
    const highCount = students.filter((s) => s.riskLevel === "High").length;
    const atRisk = moderateCount + highCount;

    const avgScore = totalStudents
      ? round(students.reduce((sum, s) => sum + s.score, 0) / totalStudents)
      : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        atRisk,
        low: totalStudents ? round((lowCount / totalStudents) * 100) : 0,
        moderate: totalStudents ? round((moderateCount / totalStudents) * 100) : 0,
        high: totalStudents ? round((highCount / totalStudents) * 100) : 0,
        avgScore,
      },
    });
  } catch (err) {
    console.error("Overview fetch error", err);
    res.status(500).json({ success: false, message: "Failed to load overview" });
  }
});

router.get("/trends", verifyToken, ensureAdmin, async (_req, res) => {
  try {
    const students = await getStudentsSnapshot();
    const data = buildTrendData(students, 4);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Trends fetch error", err);
    res.status(500).json({ success: false, message: "Failed to load trend data" });
  }
});

router.get("/risk-students", verifyToken, ensureAdmin, async (_req, res) => {
  try {
    const students = await getStudentsSnapshot();
    const data = students
      .filter((s) => s.riskLevel !== "Low")
      .sort((a, b) => {
        const aDate = safeDate(a.lastRiskCheckAt) || new Date(0);
        const bDate = safeDate(b.lastRiskCheckAt) || new Date(0);
        return bDate.getTime() - aDate.getTime();
      })
      .slice(0, 8)
      .map((student) => ({
        id: student.studentCode,
        date: formatDateLabel(student.lastRiskCheckAt || student.updatedAt),
        level: student.riskLevel,
      }));

    res.json({ success: true, data });
  } catch (err) {
    console.error("Risk students fetch error", err);
    res.status(500).json({ success: false, message: "Failed to load risk students" });
  }
});

router.get("/counsellors", verifyToken, ensureAdmin, async (_req, res) => {
  try {
    const [counsellors, sessionMap] = await Promise.all([
      Counselor.find().lean(),
      getCounsellorSessionMap(),
    ]);

    const data = counsellors
      .map((c) => ({
        name: c.name,
        sessions: sessionMap.get(String(c._id)) || 0,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 6);

    res.json({ success: true, data });
  } catch (err) {
    console.error("Counsellors fetch error", err);
    res.status(500).json({ success: false, message: "Failed to load counsellors" });
  }
});

router.get("/peer-topics", verifyToken, ensureAdmin, async (_req, res) => {
  try {
    const [posts, communities] = await Promise.all([
      CommunityPost.find().lean(),
      Community.find().lean(),
    ]);

    const topicCounts = new Map();
    posts.forEach((post) => {
      const text = `${post.title || ""} ${post.content || ""}`;
      const topic = classifyTopic(text);
      if (topic) topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    });

    if (!topicCounts.size) {
      communities.forEach((community) => {
        const topic = community.category || "General Support";
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    }

    const data = [...topicCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    res.json({ success: true, data });
  } catch (err) {
    console.error("Peer topics fetch error", err);
    res.status(500).json({ success: false, message: "Failed to load peer topics" });
  }
});

router.get("/reports", verifyToken, ensureAdmin, async (_req, res) => {
  try {
    const students = await getStudentsSnapshot();
    const aiInteractionsCount = await ChatMessage.countDocuments();

    const aiInteractions = aiInteractionsCount || students.reduce((sum, student) => {
      return sum + (student.quizScores?.length || 0) + (student.moodHistory?.length || 0);
    }, 0);

    const crisisAlerts = students.reduce((sum, student) => sum + (student.crisisAlertsCount || 0), 0)
      || students.filter((student) => student.riskLevel === "High").length;

    const emergencyCases = students.reduce((sum, student) => sum + (student.emergencyCasesCount || 0), 0)
      || students.filter((student) => student.score < 45).length;

    res.json({
      success: true,
      data: {
        aiInteractions,
        crisisAlerts,
        emergencyCases,
      },
    });
  } catch (err) {
    console.error("Reports fetch error", err);
    res.status(500).json({ success: false, message: "Failed to load reports" });
  }
});

/* -------------------- Analytics -------------------- */

router.get("/analytics", verifyToken, ensureAdmin, async (_req, res) => {
  try {
    const students = await getStudentsSnapshot();
    const totalStudents = students.length || 1;
    const avgScore = round(students.reduce((sum, s) => sum + s.score, 0) / totalStudents);
    const highRiskCount = students.filter((s) => s.riskLevel === "High").length;
    const improvingCount = students.filter((s) => s.progressDelta > 0).length;

    const trendData = buildTrendData(students, 4);

    const branchMap = new Map();
    students.forEach((student) => {
      const key = student.department || "General";
      if (!branchMap.has(key)) {
        branchMap.set(key, { total: 0, count: 0 });
      }
      const item = branchMap.get(key);
      item.total += student.score;
      item.count += 1;
    });

    const branchData = [...branchMap.entries()]
      .map(([name, item], index) => ({
        name,
        score: round(item.total / item.count),
        color: BRANCH_COLORS[index % BRANCH_COLORS.length],
      }))
      .sort((a, b) => b.score - a.score);

    const studentsData = students
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((student) => {
        const sign = student.progressDelta >= 0 ? "+" : "";
        return {
          id: student.studentCode,
          name: student.fullName,
          branch: student.department || "General",
          year: toYearLabel(student.yearOfStudy),
          score: student.score,
          progress: `${sign}${student.progressDelta} pts`,
          status: student.status,
        };
      });

    const topBranches = branchData.slice(0, 3).map((branch, index) => ({
      name: branch.name,
      score: branch.score,
      rank: index + 1,
    }));

    res.json({
      summary: {
        avgScore,
        riskPercent: round((highRiskCount / totalStudents) * 100),
        improvingPercent: round((improvingCount / totalStudents) * 100),
        critical: highRiskCount,
      },
      branchData,
      trendData,
      students: studentsData,
      topBranches,
    });
  } catch (err) {
    console.error("Analytics fetch error", err);
    res.status(500).json({ message: "Failed to load analytics" });
  }
});

/* -------------------- Counselling Center -------------------- */

router.get("/counselling", verifyToken, ensureAdmin, async (_req, res) => {
  try {
    const [students, counsellors, sessionMap, appointments] = await Promise.all([
      getStudentsSnapshot(),
      Counselor.find().lean(),
      getCounsellorSessionMap(),
      Appointment.find()
        .sort({ date: 1, time: 1 })
        .limit(12)
        .populate("counselorId", "name")
        .populate("userId", "studentId")
        .lean(),
    ]);

    const lowRisk = students.filter((s) => s.riskLevel === "Low").length;
    const moderate = students.filter((s) => s.riskLevel === "Moderate").length;
    const high = students.filter((s) => s.riskLevel === "High").length;
    const total = students.length || 1;

    const appointmentsData = appointments.map((appointment) => ({
      time: appointment.time,
      id: appointment.userId?.studentId || `STU-${String(appointment._id).slice(-4).toUpperCase()}`,
      counsellor: appointment.counselorId?.name || "Unassigned",
      mode: inferMode(appointment),
      status: mapAppointmentStatus(appointment.status),
    }));

    const counsellorData = counsellors.map((c) => {
      const sessions = sessionMap.get(String(c._id)) || 0;
      return {
        name: c.name,
        sessions,
        tag: sessions > 0 ? "Appointments" : "Available",
      };
    }).sort((a, b) => b.sessions - a.sessions);

    res.json({
      stats: {
        lowRisk,
        moderate,
        csce: counsellors.length,
        highRisk: round((high / total) * 100),
      },
      appointments: appointmentsData,
      counsellors: counsellorData,
    });
  } catch (err) {
    console.error("Counselling center fetch error", err);
    res.status(500).json({ message: "Failed to load counselling center data" });
  }
});

/* -------------------- Risk Detection -------------------- */

router.get("/risk", verifyToken, ensureAdmin, async (_req, res) => {
  try {
    const students = await getStudentsSnapshot();
    const low = students.filter((s) => s.riskLevel === "Low").length;
    const moderate = students.filter((s) => s.riskLevel === "Moderate").length;
    const high = students.filter((s) => s.riskLevel === "High").length;
    const total = students.length;

    const studentsData = students
      .sort((a, b) => {
        const riskOrder = { High: 3, Moderate: 2, Low: 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      })
      .slice(0, 12)
      .map((student) => ({
        id: student.studentCode,
        level: student.riskLevel,
        date: formatDateLabel(student.lastRiskCheckAt || student.updatedAt),
        dept: student.department || "General",
      }));

    const riskBreakdown = buildRiskBreakdown(students);

    res.json({
      riskSummary: { low, moderate, high, total },
      students: studentsData,
      riskBreakdown,
    });
  } catch (err) {
    console.error("Risk detection fetch error", err);
    res.status(500).json({ message: "Failed to load risk data" });
  }
});

/* -------------------- Peer Support -------------------- */

router.get("/peer-support", verifyToken, ensureAdmin, async (_req, res) => {
  try {
    const [mentors, groups, recentPosts] = await Promise.all([
      User.find({
        role: "volunteer",
        "peerMentorProfile.isMentor": true,
      }).lean(),
      Community.find({ isActive: true }).lean(),
      CommunityPost.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("author", "fullName")
        .lean(),
    ]);

    const peerMentors = mentors.map((mentor) => ({
      name: mentor.fullName,
      branch: mentor.department || "General",
      year: toYearLabel(mentor.yearOfStudy),
      rating: mentor.peerMentorProfile?.mentorRating || 0,
      sessions: mentor.peerMentorProfile?.sessionsHandled || 0,
      avatar: mentor.username || mentor.studentId || String(mentor._id),
      specialty: mentor.peerMentorProfile?.specialty || "General Support",
      available: Boolean(mentor.peerMentorProfile?.available),
    })).sort((a, b) => b.rating - a.rating);

    const supportGroups = groups.map((group, index) => ({
      name: group.name,
      members: group.members?.length || 0,
      nextSession: formatNextSession(group.nextSessionAt),
      category: group.category || "General Support",
      color: GROUP_COLORS[index % GROUP_COLORS.length],
    }));

    const recentChats = recentPosts.slice(0, 3).map((post) => ({
      from: post.author?.fullName || "Peer Mentor",
      message: post.content || post.title || "Support update",
      time: formatTimeAgo(post.createdAt),
    }));

    const totalSessions = peerMentors.reduce((sum, mentor) => sum + mentor.sessions, 0);
    const avgRating = peerMentors.length
      ? Number((peerMentors.reduce((sum, mentor) => sum + mentor.rating, 0) / peerMentors.length).toFixed(1))
      : 0;

    res.json({
      stats: {
        mentors: peerMentors.length,
        groups: supportGroups.length,
        sessions: totalSessions,
        rating: avgRating,
      },
      peerMentors,
      supportGroups,
      recentChats,
    });
  } catch (err) {
    console.error("Peer support fetch error", err);
    res.status(500).json({ message: "Failed to load peer support data" });
  }
});

/* -------------------- Settings -------------------- */

router.get("/profile", verifyToken, ensureAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.userId).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error("Admin profile fetch error", err);
    res.status(500).json({ message: "Profile fetch failed" });
  }
});

router.put("/profile", verifyToken, ensureAdmin, async (req, res) => {
  try {
    const { name, email, phone, role, department, campus } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.user.userId,
      { name, email, phone, role, department, campus },
      { new: true }
    ).select("-password");

    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error("Admin profile update error", err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

module.exports = router;
