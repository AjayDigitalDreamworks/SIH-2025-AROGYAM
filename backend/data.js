const counsellor = [
  {
id: '1',
name: 'Dr. Sarah Johnson',
specialty: 'Anxiety & Depression',
rating: 4.9,
experience: '8 years',
image: '👩‍⚕️'
},
{
id: '2',
name: 'Dr. Michael Chen',
specialty: 'Academic Stress',
rating: 4.8,
experience: '6 years',
image: '👨‍⚕️'
},
{
id: '3',
name: 'Dr. Emily Rodriguez',
specialty: 'Relationship & Social',
rating: 4.9,
experience: '10 years',
image: '👩‍⚕️'
},
{
id: '4',
name: 'Dr. alpha Rodriguez',
specialty: 'depression & Social',
rating: 4.9,
experience: '10 years',
image: '👩‍⚕️'
},
];

const  appointments = [
  {
    "id": "a1",
    "counselorId": "1",
    "date": "2025-09-10",
    "time": "10:00 AM",
    "type": "Individual Counseling (50 min)",
    "fullName": "anshul",
    "email": "anshul.mangla@acem.edu.in",
    "phone": "9354166188",
    "discussion": "noo"
  }
];

const users = [
  {
    "_id": "63f1a3b2c8d4e5f678901234",
    "fullName": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "username": "aarav_sh",
    "phone": "+91-9876543210",
    "password": "Password123!", 
    "avatar": "🎓",
    "university": "Indian Institute of Technology",
    "yearOfStudy": "3rd year",
    "moodHistory": [
      { "date": "2026-01-04T10:00:00.000Z", "mood": 4, "notes": "Focused on projects" },
      { "date": "2025-12-28T18:30:00.000Z", "mood": 3, "notes": "Exam stress" }
    ],
    "sleepHistory": [
      { "date": "2026-01-04T07:00:00.000Z", "hours": 7, "quality": 4 },
      { "date": "2025-12-28T07:00:00.000Z", "hours": 6.5, "quality": 3 }
    ],
    "appointments": ["601e3a1b2c3d4e5f678901a1"],
    "quizScores": [
      { "score": 85, "quiz_type": "Stress Awareness", "date": "2025-11-01T09:00:00.000Z" }
    ],
    "createdAt": "2025-06-01T12:00:00.000Z",
    "updatedAt": "2026-01-04T10:15:00.000Z"
  },
  {
    "_id": "63f2b4c3d9e5f6a789012345",
    "fullName": "Maya Kapoor",
    "email": "maya.kapoor@example.com",
    "username": "maya_k",
    "phone": "+91-9123456780",
    "password": "MayaPass!2025",
    "avatar": "🌸",
    "university": "National Institute of Fashion Technology",
    "yearOfStudy": "2nd year",
    "moodHistory": [
      { "date": "2026-01-03T08:30:00.000Z", "mood": 5, "notes": "Good week" },
      { "date": "2025-12-20T20:00:00.000Z", "mood": 4, "notes": "Creative and productive" }
    ],
    "sleepHistory": [
      { "date": "2026-01-03T07:30:00.000Z", "hours": 8, "quality": 5 }
    ],
    "appointments": [],
    "quizScores": [
      { "score": 92, "quiz_type": "Wellness Basics", "date": "2025-10-15T14:00:00.000Z" }
    ],
    "createdAt": "2025-08-10T10:00:00.000Z",
    "updatedAt": "2026-01-03T08:40:00.000Z"
  },
  {
    "_id": "63f3c5d4e0f6a7b890123456",
    "fullName": "Riya Menon",
    "email": "riya.menon@example.com",
    "username": "riya_menon",
    "phone": "+91-9988776655",
    "password": "RiyaSecure!",
    "avatar": "😊",
    "university": "University of Delhi",
    "yearOfStudy": "4th year",
    "moodHistory": [
      { "date": "2025-12-31T22:00:00.000Z", "mood": 2, "notes": "Lonely during holidays" },
      { "date": "2025-12-15T11:00:00.000Z", "mood": 3, "notes": "Managing deadlines" }
    ],
    "sleepHistory": [
      { "date": "2025-12-31T08:00:00.000Z", "hours": 5, "quality": 2 }
    ],
    "appointments": ["601e3a1b2c3d4e5f678901a2"],
    "quizScores": [
      { "score": 70, "quiz_type": "Depression Screening", "date": "2025-12-20T10:00:00.000Z" }
    ],
    "createdAt": "2024-11-05T15:20:00.000Z",
    "updatedAt": "2026-01-01T09:00:00.000Z"
  },
  {
    "_id": "63f4d6e5f1a7b8c901234567",
    "fullName": "Karan Verma",
    "email": "karan.verma@example.com",
    "username": "karanv",
    "phone": null,
    "password": "Karan#2025",
    "avatar": "🏀",
    "university": "Delhi Technological University",
    "yearOfStudy": "1st year",
    "moodHistory": [
      { "date": "2026-01-02T13:00:00.000Z", "mood": 4, "notes": "Settling into semester" }
    ],
    "sleepHistory": [
      { "date": "2026-01-02T06:30:00.000Z", "hours": 7.5, "quality": 4 }
    ],
    "appointments": [],
    "quizScores": [
      { "score": 78, "quiz_type": "Exam Anxiety", "date": "2025-12-10T12:00:00.000Z" }
    ],
    "createdAt": "2025-09-01T08:00:00.000Z",
    "updatedAt": "2026-01-02T13:15:00.000Z"
  },
  {
    "_id": "63f5e7f6a2b8c9d012345678",
    "fullName": "Sneha Iyer",
    "email": "sneha.iyer@example.com",
    "username": "sneha_iy",
    "phone": "+91-9012345678",
    "password": "Sneha!Pass",
    "avatar": "✨",
    "university": "University of Mumbai",
    "yearOfStudy": "3rd year",
    "moodHistory": [
      { "date": "2026-01-01T09:00:00.000Z", "mood": 3, "notes": "Okay, tired" }
    ],
    "sleepHistory": [
      { "date": "2026-01-01T07:00:00.000Z", "hours": 6, "quality": 3 }
    ],
    "appointments": ["601e3a1b2c3d4e5f678901a3"],
    "quizScores": [
      { "score": 88, "quiz_type": "Mindfulness", "date": "2025-09-20T10:30:00.000Z" }
    ],
    "createdAt": "2025-04-21T11:00:00.000Z",
    "updatedAt": "2026-01-01T09:20:00.000Z"
  },
  {
    "_id": "63f6f801b3c9d0e123456789",
    "fullName": "Ishan Patel",
    "email": "ishan.patel@example.com",
    "username": "ishan_p",
    "phone": "+91-8899007766",
    "password": "IshanPwd2025",
    "avatar": "⚽",
    "university": "Pune University",
    "yearOfStudy": "2nd year",
    "moodHistory": [
      { "date": "2025-12-18T14:00:00.000Z", "mood": 5, "notes": "Great day" }
    ],
    "sleepHistory": [
      { "date": "2025-12-18T07:00:00.000Z", "hours": 8, "quality": 5 }
    ],
    "appointments": [],
    "quizScores": [
      { "score": 95, "quiz_type": "Resilience", "date": "2025-11-30T09:00:00.000Z" }
    ],
    "createdAt": "2024-12-10T13:00:00.000Z",
    "updatedAt": "2025-12-18T14:30:00.000Z"
  },
  {
    "_id": "63f70912c4d0e1f234567890",
    "fullName": "Ananya Gupta",
    "email": "ananya.gupta@example.com",
    "username": "ananya_g",
    "phone": "+91-7999887766",
    "password": "Ananya#1",
    "avatar": "🌿",
    "university": "Jawaharlal Nehru University",
    "yearOfStudy": "4th year",
    "moodHistory": [
      { "date": "2025-12-05T10:00:00.000Z", "mood": 2, "notes": "Feeling overwhelmed" },
      { "date": "2025-11-01T10:00:00.000Z", "mood": 3, "notes": "Seeking support" }
    ],
    "sleepHistory": [
      { "date": "2025-12-05T07:30:00.000Z", "hours": 5, "quality": 2 }
    ],
    "appointments": ["601e3a1b2c3d4e5f678901a4"],
    "quizScores": [
      { "score": 60, "quiz_type": "Depression Screening", "date": "2025-12-06T11:00:00.000Z" }
    ],
    "createdAt": "2025-01-15T09:30:00.000Z",
    "updatedAt": "2025-12-06T11:30:00.000Z"
  },
  {
    "_id": "63f81a23d5e1f2a345678901",
    "fullName": "Vikram Singh",
    "email": "vikram.singh@example.com",
    "username": "vikram_s",
    "phone": "+91-7665544332",
    "password": "VikramPass!",
    "avatar": "🎧",
    "university": "Indian Institute of Science Education and Research",
    "yearOfStudy": "1st year",
    "moodHistory": [
      { "date": "2026-01-04T12:00:00.000Z", "mood": 4, "notes": "Good lab day" }
    ],
    "sleepHistory": [
      { "date": "2026-01-04T07:45:00.000Z", "hours": 7, "quality": 4 }
    ],
    "appointments": [],
    "quizScores": [
      { "score": 82, "quiz_type": "Time Management", "date": "2025-10-01T08:00:00.000Z" }
    ],
    "createdAt": "2025-07-01T10:00:00.000Z",
    "updatedAt": "2026-01-04T12:10:00.000Z"
  },
  {
    "_id": "63f92b34e6f2a3b456789012",
    "fullName": "Priya Nair",
    "email": "priya.nair@example.com",
    "username": "priya_nair",
    "phone": "+91-9554433221",
    "password": "Priya#2025",
    "avatar": "📚",
    "university": "Kerala University",
    "yearOfStudy": "2nd year",
    "moodHistory": [
      { "date": "2025-11-25T16:00:00.000Z", "mood": 3, "notes": "Mixed feelings about placement" }
    ],
    "sleepHistory": [
      { "date": "2025-11-25T23:30:00.000Z", "hours": 5.5, "quality": 3 }
    ],
    "appointments": [],
    "quizScores": [
      { "score": 74, "quiz_type": "Career Readiness", "date": "2025-11-20T10:00:00.000Z" }
    ],
    "createdAt": "2025-03-08T09:00:00.000Z",
    "updatedAt": "2025-11-25T16:10:00.000Z"
  }
];



module.exports = { counsellor, appointments , users};