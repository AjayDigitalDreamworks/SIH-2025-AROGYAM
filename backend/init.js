const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");
const User = require("./models/user");
const Counselor = require("./models/counsellor");
const Appointment = require("./models/appointment");
const Community = require("./models/community");
const CommunityPost = require("./models/comments");
const ChatMessage = require("./models/chat");

dotenv.config();

const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const dateFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

const studentSeed = [
  {
    studentId: "STU-1574",
    fullName: "Rahul Sharma",
    email: "rahul.sharma@campus.edu",
    username: "rahul_sharma",
    phone: "9876543210",
    university: "Arogyam University",
    yearOfStudy: "3",
    department: "CSE",
    section: "A",
    residenceType: "Hostel",
    wellbeingScore: 84,
    riskLevel: "Low",
    riskFactors: ["Academic Stress"],
    crisisAlertsCount: 0,
    emergencyCasesCount: 0,
    moodHistory: [
      { date: daysAgo(1), mood: 4, notes: "Productive day" },
      { date: daysAgo(8), mood: 3, notes: "Exam pressure" },
    ],
    sleepHistory: [
      { date: daysAgo(1), hours: 7, quality: 4 },
      { date: daysAgo(8), hours: 6.2, quality: 3 },
    ],
    quizScores: [
      { score: 78, quiz_type: "Stress Check", date: daysAgo(12) },
      { score: 84, quiz_type: "Stress Check", date: daysAgo(2) },
    ],
  },
  {
    studentId: "STU-2459",
    fullName: "Ananya Patel",
    email: "ananya.patel@campus.edu",
    username: "ananya_patel",
    phone: "9876501203",
    university: "Arogyam University",
    yearOfStudy: "2",
    department: "ECE",
    section: "B",
    residenceType: "Day Scholar",
    wellbeingScore: 68,
    riskLevel: "Moderate",
    riskFactors: ["Sleep Problems", "Academic Stress"],
    crisisAlertsCount: 1,
    emergencyCasesCount: 0,
    moodHistory: [
      { date: daysAgo(1), mood: 3, notes: "Could be better" },
      { date: daysAgo(9), mood: 2, notes: "Overwhelmed" },
    ],
    sleepHistory: [
      { date: daysAgo(1), hours: 5.5, quality: 2 },
      { date: daysAgo(9), hours: 5.2, quality: 2 },
    ],
    quizScores: [
      { score: 72, quiz_type: "Sleep & Stress", date: daysAgo(15) },
      { score: 68, quiz_type: "Sleep & Stress", date: daysAgo(3) },
    ],
  },
  {
    studentId: "STU-3291",
    fullName: "Vikram Singh",
    email: "vikram.singh@campus.edu",
    username: "vikram_singh",
    phone: "9822201144",
    university: "Arogyam University",
    yearOfStudy: "4",
    department: "ME",
    section: "A",
    residenceType: "Hostel",
    wellbeingScore: 72,
    riskLevel: "Moderate",
    riskFactors: ["Career Anxiety"],
    crisisAlertsCount: 0,
    emergencyCasesCount: 0,
    moodHistory: [
      { date: daysAgo(2), mood: 3, notes: "Final year pressure" },
      { date: daysAgo(10), mood: 3, notes: "Stable" },
    ],
    sleepHistory: [
      { date: daysAgo(2), hours: 6.8, quality: 3 },
      { date: daysAgo(10), hours: 6.5, quality: 3 },
    ],
    quizScores: [
      { score: 70, quiz_type: "Career Readiness", date: daysAgo(14) },
      { score: 72, quiz_type: "Career Readiness", date: daysAgo(4) },
    ],
  },
  {
    studentId: "STU-4422",
    fullName: "Sneha Reddy",
    email: "sneha.reddy@campus.edu",
    username: "sneha_reddy",
    phone: "9008800112",
    university: "Arogyam University",
    yearOfStudy: "3",
    department: "BBA",
    section: "C",
    residenceType: "Day Scholar",
    wellbeingScore: 89,
    riskLevel: "Low",
    riskFactors: ["Workload"],
    crisisAlertsCount: 0,
    emergencyCasesCount: 0,
    moodHistory: [
      { date: daysAgo(1), mood: 5, notes: "Great routine" },
      { date: daysAgo(7), mood: 4, notes: "Balanced week" },
    ],
    sleepHistory: [
      { date: daysAgo(1), hours: 8, quality: 5 },
      { date: daysAgo(7), hours: 7.5, quality: 4 },
    ],
    quizScores: [
      { score: 80, quiz_type: "Wellbeing Basics", date: daysAgo(13) },
      { score: 89, quiz_type: "Wellbeing Basics", date: daysAgo(3) },
    ],
  },
  {
    studentId: "STU-5188",
    fullName: "Omar Farooq",
    email: "omar.farooq@campus.edu",
    username: "omar_farooq",
    phone: "9001102203",
    university: "Arogyam University",
    yearOfStudy: "1",
    department: "BSC",
    section: "D",
    residenceType: "Hostel",
    wellbeingScore: 54,
    riskLevel: "High",
    riskFactors: ["Homesickness", "Sleep Problems"],
    crisisAlertsCount: 2,
    emergencyCasesCount: 1,
    moodHistory: [
      { date: daysAgo(1), mood: 2, notes: "Missing home" },
      { date: daysAgo(6), mood: 2, notes: "Low energy" },
    ],
    sleepHistory: [
      { date: daysAgo(1), hours: 5.1, quality: 2 },
      { date: daysAgo(6), hours: 5.4, quality: 2 },
    ],
    quizScores: [
      { score: 60, quiz_type: "Adjustment Scale", date: daysAgo(12) },
      { score: 54, quiz_type: "Adjustment Scale", date: daysAgo(2) },
    ],
  },
  {
    studentId: "STU-6104",
    fullName: "Priya Nair",
    email: "priya.nair@campus.edu",
    username: "priya_nair",
    phone: "9113300445",
    university: "Arogyam University",
    yearOfStudy: "2",
    department: "MBA",
    section: "A",
    residenceType: "Day Scholar",
    wellbeingScore: 79,
    riskLevel: "Low",
    riskFactors: ["Placement Anxiety"],
    crisisAlertsCount: 0,
    emergencyCasesCount: 0,
    moodHistory: [
      { date: daysAgo(2), mood: 4, notes: "Interview prep ongoing" },
      { date: daysAgo(9), mood: 3, notes: "Nervous but okay" },
    ],
    sleepHistory: [
      { date: daysAgo(2), hours: 7.2, quality: 4 },
      { date: daysAgo(9), hours: 6.8, quality: 3 },
    ],
    quizScores: [
      { score: 75, quiz_type: "Career Anxiety", date: daysAgo(14) },
      { score: 79, quiz_type: "Career Anxiety", date: daysAgo(5) },
    ],
  },
  {
    studentId: "STU-7340",
    fullName: "Aarav Menon",
    email: "aarav.menon@campus.edu",
    username: "aarav_menon",
    phone: "9222200011",
    university: "Arogyam University",
    yearOfStudy: "1",
    department: "IT",
    section: "B",
    residenceType: "Hostel",
    wellbeingScore: 62,
    riskLevel: "Moderate",
    riskFactors: ["Homesickness", "Social Anxiety"],
    crisisAlertsCount: 1,
    emergencyCasesCount: 0,
    moodHistory: [
      { date: daysAgo(1), mood: 3, notes: "Trying to adapt" },
      { date: daysAgo(8), mood: 2, notes: "Struggling socially" },
    ],
    sleepHistory: [
      { date: daysAgo(1), hours: 6.1, quality: 3 },
      { date: daysAgo(8), hours: 5.8, quality: 2 },
    ],
    quizScores: [
      { score: 66, quiz_type: "Social Adjustment", date: daysAgo(13) },
      { score: 62, quiz_type: "Social Adjustment", date: daysAgo(3) },
    ],
  },
  {
    studentId: "STU-8912",
    fullName: "Kavya Iyer",
    email: "kavya.iyer@campus.edu",
    username: "kavya_iyer",
    phone: "9338899002",
    university: "Arogyam University",
    yearOfStudy: "4",
    department: "Civil",
    section: "A",
    residenceType: "Day Scholar",
    wellbeingScore: 49,
    riskLevel: "High",
    riskFactors: ["Academic Stress", "Sleep Problems"],
    crisisAlertsCount: 3,
    emergencyCasesCount: 1,
    moodHistory: [
      { date: daysAgo(1), mood: 2, notes: "Very anxious" },
      { date: daysAgo(5), mood: 2, notes: "Low confidence" },
    ],
    sleepHistory: [
      { date: daysAgo(1), hours: 4.8, quality: 2 },
      { date: daysAgo(5), hours: 5.0, quality: 2 },
    ],
    quizScores: [
      { score: 56, quiz_type: "Burnout Check", date: daysAgo(11) },
      { score: 49, quiz_type: "Burnout Check", date: daysAgo(2) },
    ],
  },
  {
    studentId: "STU-6642",
    fullName: "Neha Kapoor",
    email: "neha.kapoor@campus.edu",
    username: "neha_kapoor",
    phone: "9447700112",
    university: "Arogyam University",
    yearOfStudy: "3",
    department: "EEE",
    section: "C",
    residenceType: "Hostel",
    wellbeingScore: 82,
    riskLevel: "Low",
    riskFactors: ["Workload"],
    crisisAlertsCount: 0,
    emergencyCasesCount: 0,
    moodHistory: [
      { date: daysAgo(1), mood: 4, notes: "Busy but calm" },
      { date: daysAgo(9), mood: 4, notes: "Managing schedule" },
    ],
    sleepHistory: [
      { date: daysAgo(1), hours: 7.3, quality: 4 },
      { date: daysAgo(9), hours: 7.0, quality: 4 },
    ],
    quizScores: [
      { score: 78, quiz_type: "Stress Check", date: daysAgo(15) },
      { score: 82, quiz_type: "Stress Check", date: daysAgo(4) },
    ],
  },
  {
    studentId: "STU-7021",
    fullName: "Ishan Gupta",
    email: "ishan.gupta@campus.edu",
    username: "ishan_gupta",
    phone: "9556200344",
    university: "Arogyam University",
    yearOfStudy: "2",
    department: "CSE",
    section: "D",
    residenceType: "Day Scholar",
    wellbeingScore: 74,
    riskLevel: "Moderate",
    riskFactors: ["Career Anxiety"],
    crisisAlertsCount: 0,
    emergencyCasesCount: 0,
    moodHistory: [
      { date: daysAgo(3), mood: 4, notes: "Doing better" },
      { date: daysAgo(10), mood: 3, notes: "Uncertain about direction" },
    ],
    sleepHistory: [
      { date: daysAgo(3), hours: 6.7, quality: 3 },
      { date: daysAgo(10), hours: 6.2, quality: 3 },
    ],
    quizScores: [
      { score: 69, quiz_type: "Career Readiness", date: daysAgo(15) },
      { score: 74, quiz_type: "Career Readiness", date: daysAgo(4) },
    ],
  },
];

const mentorSeed = [
  {
    studentId: "VOL-101",
    fullName: "Ananya Sharma",
    email: "mentor.ananya@campus.edu",
    username: "mentor_ananya",
    yearOfStudy: "3",
    department: "CSE",
    peerMentorProfile: {
      isMentor: true,
      specialty: "Academic Stress",
      sessionsHandled: 42,
      mentorRating: 4.8,
      available: true,
    },
  },
  {
    studentId: "VOL-102",
    fullName: "Rohan Mehta",
    email: "mentor.rohan@campus.edu",
    username: "mentor_rohan",
    yearOfStudy: "4",
    department: "ECE",
    peerMentorProfile: {
      isMentor: true,
      specialty: "Social Anxiety",
      sessionsHandled: 67,
      mentorRating: 4.9,
      available: true,
    },
  },
  {
    studentId: "VOL-103",
    fullName: "Priya Patel",
    email: "mentor.priya@campus.edu",
    username: "mentor_priya",
    yearOfStudy: "3",
    department: "ME",
    peerMentorProfile: {
      isMentor: true,
      specialty: "Exam Anxiety",
      sessionsHandled: 35,
      mentorRating: 4.7,
      available: false,
    },
  },
  {
    studentId: "VOL-104",
    fullName: "Arjun Nair",
    email: "mentor.arjun@campus.edu",
    username: "mentor_arjun",
    yearOfStudy: "4",
    department: "IT",
    peerMentorProfile: {
      isMentor: true,
      specialty: "Career Guidance",
      sessionsHandled: 28,
      mentorRating: 4.6,
      available: true,
    },
  },
];

const counsellorSeed = [
  {
    username: "dr_mehta",
    email: "mehta@arogyam.org",
    name: "Dr. Mehta",
    specialty: "Stress & Anxiety",
    experience: "8 years",
    rating: 4.8,
    image: "doctor-mehta",
    isApproved: true,
  },
  {
    username: "dr_kumar",
    email: "kumar@arogyam.org",
    name: "Dr. Kumar",
    specialty: "Academic Burnout",
    experience: "6 years",
    rating: 4.7,
    image: "doctor-kumar",
    isApproved: true,
  },
  {
    username: "ms_rao",
    email: "rao@arogyam.org",
    name: "Ms. Rao",
    specialty: "Peer & Social Support",
    experience: "5 years",
    rating: 4.6,
    image: "doctor-rao",
    isApproved: true,
  },
];

async function seedDatabase() {
  try {
    await Promise.all([
      Admin.deleteMany({}),
      User.deleteMany({}),
      Counselor.deleteMany({}),
      Appointment.deleteMany({}),
      Community.deleteMany({}),
      CommunityPost.deleteMany({}),
      ChatMessage.deleteMany({}),
    ]);
    console.log("Cleared existing collections");

    const adminPassword = await bcrypt.hash("Admin@123", 12);
    const admin = await Admin.create({
      username: "admin",
      password: adminPassword,
      name: "Campus Wellness Admin",
      role: "admin",
      email: "admin@arogyam.org",
      phone: "9000000001",
      department: "Student Wellness",
      campus: "Main Campus",
    });

    const counselorDocs = await Promise.all(
      counsellorSeed.map(async (seed) => ({
        ...seed,
        password: await bcrypt.hash("Counsellor@123", 10),
      }))
    );
    const counsellors = await Counselor.insertMany(counselorDocs);

    const studentDocs = await Promise.all(
      studentSeed.map(async (seed) => ({
        ...seed,
        password: await bcrypt.hash("Student@123", 10),
        role: "student",
      }))
    );
    const students = await User.insertMany(studentDocs);

    const mentorDocs = await Promise.all(
      mentorSeed.map(async (seed) => ({
        ...seed,
        password: await bcrypt.hash("Volunteer@123", 10),
        role: "volunteer",
        university: "Arogyam University",
        residenceType: "Day Scholar",
        wellbeingScore: 80,
        riskLevel: "Low",
      }))
    );
    const mentors = await User.insertMany(mentorDocs);

    const studentByCode = new Map(students.map((student) => [student.studentId, student]));
    const counsellorByName = new Map(counsellors.map((c) => [c.name, c]));

    const appointmentSeed = [
      { time: "10:00 AM", studentId: "STU-1574", counsellor: "Dr. Mehta", mode: "Offline", status: "accepted", offsetDays: 1 },
      { time: "11:00 AM", studentId: "STU-2459", counsellor: "Dr. Kumar", mode: "Offline", status: "pending", offsetDays: 1 },
      { time: "12:00 PM", studentId: "STU-5188", counsellor: "Dr. Mehta", mode: "Online", status: "accepted", offsetDays: 1 },
      { time: "02:00 PM", studentId: "STU-8912", counsellor: "Ms. Rao", mode: "Online", status: "completed", offsetDays: 0 },
      { time: "03:00 PM", studentId: "STU-7340", counsellor: "Dr. Kumar", mode: "Online", status: "modified", offsetDays: 2 },
      { time: "04:00 PM", studentId: "STU-3291", counsellor: "Ms. Rao", mode: "Offline", status: "accepted", offsetDays: 2 },
      { time: "05:00 PM", studentId: "STU-6104", counsellor: "Dr. Mehta", mode: "Online", status: "completed", offsetDays: -1 },
    ];

    const appointmentDocs = appointmentSeed.map((seed) => {
      const student = studentByCode.get(seed.studentId);
      const counsellor = counsellorByName.get(seed.counsellor);
      const dateValue = dateFromNow(seed.offsetDays).toISOString().split("T")[0];

      return {
        counselorId: counsellor._id,
        userId: student._id,
        date: dateValue,
        time: seed.time,
        type: `${seed.mode} Counseling Session`,
        mode: seed.mode,
        fullName: student.fullName,
        email: student.email,
        phone: student.phone || "9999999999",
        discussion: "Follow-up wellbeing support",
        status: seed.status,
        requestedAt: daysAgo(2),
      };
    });

    const appointments = await Appointment.insertMany(appointmentDocs);

    const appointmentsByUser = new Map();
    appointments.forEach((appt) => {
      const key = String(appt.userId);
      if (!appointmentsByUser.has(key)) appointmentsByUser.set(key, []);
      appointmentsByUser.get(key).push(appt._id);
    });

    await Promise.all(
      [...appointmentsByUser.entries()].map(([userId, appointmentIds]) =>
        User.findByIdAndUpdate(userId, { $set: { appointments: appointmentIds } })
      )
    );

    const communities = await Community.insertMany([
      {
        name: "Stress Busters Circle",
        description: "Weekly support for exam and coursework stress.",
        category: "Exam Stress",
        createdBy: mentors[0]._id,
        members: [students[0]._id, students[1]._id, students[9]._id, mentors[0]._id],
        nextSessionAt: dateFromNow(0),
        isActive: true,
      },
      {
        name: "Mindful Mondays",
        description: "Mindfulness and breathing group sessions.",
        category: "Mindfulness",
        createdBy: mentors[1]._id,
        members: [students[2]._id, students[5]._id, students[8]._id, mentors[1]._id],
        nextSessionAt: dateFromNow(3),
        isActive: true,
      },
      {
        name: "Career Compass",
        description: "Peer discussions around placements and internships.",
        category: "Placement Anxiety",
        createdBy: mentors[3]._id,
        members: [students[3]._id, students[6]._id, students[7]._id, mentors[3]._id],
        nextSessionAt: dateFromNow(5),
        isActive: true,
      },
      {
        name: "Safe Space Talks",
        description: "Open discussions for emotional support.",
        category: "General Support",
        createdBy: mentors[2]._id,
        members: [students[4]._id, students[7]._id, mentors[2]._id],
        nextSessionAt: dateFromNow(2),
        isActive: true,
      },
    ]);

    const posts = await CommunityPost.insertMany([
      {
        community: communities[0]._id,
        author: students[0]._id,
        title: "Exam panic before internals",
        content: "I feel exam stress building up. Any practical revision strategy?",
        likes: [students[1]._id],
        createdAt: daysAgo(1),
      },
      {
        community: communities[2]._id,
        author: students[5]._id,
        title: "Placement prep anxiety",
        content: "Placement interviews are close and my career anxiety is high.",
        likes: [students[6]._id, mentors[3]._id],
        createdAt: daysAgo(2),
      },
      {
        community: communities[3]._id,
        author: students[4]._id,
        title: "Homesick in hostel",
        content: "I've been feeling lonely in hostel and missing family badly.",
        likes: [students[7]._id],
        createdAt: daysAgo(1),
      },
      {
        community: communities[1]._id,
        author: mentors[1]._id,
        title: "Sleep reset challenge",
        content: "Let's build a better sleep schedule this week.",
        likes: [students[2]._id, students[8]._id],
        createdAt: daysAgo(0),
      },
    ]);

    await ChatMessage.insertMany([
      {
        communityId: String(communities[0]._id),
        senderProfileId: String(mentors[0]._id),
        message: "Break your study into short focused blocks.",
        timestamp: daysAgo(0),
      },
      {
        communityId: String(communities[2]._id),
        senderProfileId: String(mentors[3]._id),
        message: "Start with mock interview rounds, confidence improves quickly.",
        timestamp: daysAgo(0),
      },
      {
        communityId: String(communities[3]._id),
        senderProfileId: String(mentors[2]._id),
        message: "You're not alone. Join today's support circle at 5 PM.",
        timestamp: daysAgo(0),
      },
      {
        communityId: String(communities[1]._id),
        senderProfileId: String(students[8]._id),
        message: "Meditation helped me sleep earlier this week.",
        timestamp: daysAgo(0),
      },
    ]);

    console.log("Seeded admin:", admin.username);
    console.log("Seeded students:", students.length);
    console.log("Seeded mentors:", mentors.length);
    console.log("Seeded counsellors:", counsellors.length);
    console.log("Seeded appointments:", appointments.length);
    console.log("Seeded communities:", communities.length);
    console.log("Seeded posts:", posts.length);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    return seedDatabase();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
