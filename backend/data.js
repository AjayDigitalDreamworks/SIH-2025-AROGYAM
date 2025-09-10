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
    "fullName": "Anshul Mangla",
    "email": "anshul@example.com",
    "phone": "9876543210",
    "password": "hashed_password_123",
    "avatar": "🎓",
    "university": "Delhi University",
    "yearOfStudy": "Junior",
    "moodHistory": [
      {
        "date": "2025-09-01T10:30:00Z",
        "mood": 4,
        "notes": "Feeling good after completing my project."
      },
      {
        "date": "2025-09-05T09:15:00Z",
        "mood": 2,
        "notes": "Feeling stressed before exams."
      }
    ],
    "appointments": ["64d8f4a3b2a1e5f1c2d3a9f0"], 
    "createdAt": "2025-09-10T08:00:00Z",
    "updatedAt": "2025-09-10T08:00:00Z"
  },
  {
    "fullName": "Riya Sharma",
    "email": "riya@example.com",
    "phone": "9123456789",
    "password": "hashed_password_456",
    "avatar": "https://example.com/avatar.png",
    "university": "IIT Bombay",
    "yearOfStudy": "Senior",
    "moodHistory": [
      {
        "date": "2025-09-02T14:00:00Z",
        "mood": 5,
        "notes": "Had a great day with friends."
      }
    ],
    "appointments": [],
    "createdAt": "2025-09-09T11:30:00Z",
    "updatedAt": "2025-09-09T11:30:00Z"
  }
];



module.exports = { counsellor, appointments , users};