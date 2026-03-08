
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const payload = { userId: admin._id, role: admin.role, username: admin.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { _id: admin._id, username: admin.username, name: admin.name } });
  } catch (err) {
    console.error('Admin login error', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.post('/register', verifyToken, async (req, res) => {
  const { username, password, name } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = new Admin({ username, password: hashedPassword, name });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('Admin registration error', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});


// admin dashboard route
router.get('/dashboard', verifyToken, async (req, res) => {
    res.json({ message: "Welcome to the admin dashboard", user : req.user });
});



// admin dashaboard
/* -------- Overview -------- */

router.get("/overview", (req, res) => {
  res.json({
    success: true,
    data: {
      totalStudents: 5200,
      atRisk: 1140,
      low: 68,
      moderate: 25,
      high: 7,
      avgScore: 74
    }
  });
});

/* -------- Trends -------- */

router.get("/trends", (req, res) => {
  res.json({
    success: true,
    data: [
      { week: "Week 1", score: 68 },
      { week: "Week 2", score: 72 },
      { week: "Week 3", score: 74 },
      { week: "Week 4", score: 78 }
    ]
  });
});

/* -------- Risk Students -------- */

router.get("/risk-students", (req, res) => {
  res.json({
    success: true,
    data: [
      { id: "STU-1345", date: "25-Sept", level: "High" },
      { id: "STU-2189", date: "19-Sept", level: "Moderate" },
      { id: "STU-7641", date: "14-Sept", level: "High" }
    ]
  });
});

/* -------- Counsellors -------- */

router.get("/counsellors", (req, res) => {
  res.json({
    success: true,
    data: [
      { name: "Dr. Mehta", sessions: 12 },
      { name: "Dr. Kumar", sessions: 10 },
      { name: "Ms. Rao", sessions: 8 }
    ]
  });
});

/* -------- Peer Topics -------- */

router.get("/peer-topics", (req, res) => {
  res.json({
    success: true,
    data: [
      { topic: "Exam Stress", count: 58 },
      { topic: "Homesickness", count: 41 },
      { topic: "Placement Anxiety", count: 33 }
    ]
  });
});

/* -------- Reports -------- */

router.get("/reports", (req, res) => {
  res.json({
    success: true,
    data: {
      aiInteractions: 2450,
      crisisAlerts: 6,
      emergencyCases: 4
    }
  });
});


router.get("/analytics", (req, res) => {

res.json({

summary:{
avgScore:78,
riskPercent:12,
improvingPercent:64,
critical:5
},

branchData:[
{ name:"CSE", score:82, color:"hsl(215, 65%, 55%)" },
{ name:"ECE", score:76, color:"hsl(145, 50%, 48%)" },
{ name:"ME", score:74, color:"hsl(30, 85%, 58%)" },
{ name:"BBA", score:80, color:"hsl(175, 45%, 50%)" },
{ name:"BSC", score:72, color:"hsl(260, 50%, 60%)" },
{ name:"MBA", score:79, color:"hsl(0, 72%, 58%)" }
],

trendData:[
{ week:"Week 1", score:72 },
{ week:"Week 2", score:74 },
{ week:"Week 3", score:76 },
{ week:"Week 4", score:78 }
],

students:[
{ id:"STU-1574", name:"Rahul Sharma", branch:"CSE", year:"3rd Year", score:84, progress:"+6 pts", status:"Improving" },
{ id:"STU-2459", name:"Ananya Patel", branch:"ECE", year:"2nd Year", score:68, progress:"-4 pts", status:"At Risk" },
{ id:"STU-3291", name:"Vikram Singh", branch:"ME", year:"4th Year", score:72, progress:"+2 pts", status:"Stable" },
{ id:"STU-4422", name:"Sneha Reddy", branch:"BBA", year:"3rd Year", score:89, progress:"+9 pts", status:"Excellent" },
{ id:"STU-5188", name:"Omar Farooq", branch:"BSC", year:"1st Year", score:65, progress:"-6 pts", status:"At Risk" }
],

topBranches:[
{ name:"CSE", score:82, rank:1 },
{ name:"BBA", score:80, rank:2 },
{ name:"MBA", score:79, rank:3 }
]

})

});



// counsellor

router.get("/counselling",(req,res)=>{

res.json({

stats:{
lowRisk:580,
moderate:352,
csce:42,
highRisk:92
},

appointments:[
{ time:"10:00AM", id:"STU-1768", counsellor:"Dr. Mehta", mode:"Offline", status:"Confirmed"},
{ time:"11:00AM", id:"STU-2174", counsellor:"Dr. Kumar", mode:"Offline", status:"Confirmed"},
{ time:"12:00PM", id:"STU-8321", counsellor:"Dr. Mehta", mode:"Offline", status:"Pending"},
{ time:"02:00PM", id:"STU-6245", counsellor:"STU-1288", mode:"Online", status:"Completed"},
{ time:"02:00PM", id:"STU-2189", counsellor:"Dr. Mehta", mode:"Online", status:"Pending"},
{ time:"03:00PM", id:"STU-9912", counsellor:"Dr. Mehta", mode:"Online", status:"Completed"},
{ time:"04:00PM", id:"STU-7641", counsellor:"STU-7641", mode:"Offline", status:"Completed"}
],

counsellors:[
{ name:"Dr. Mehta", sessions:12, tag:"Appointment"},
{ name:"Dr. Kumar", sessions:10, tag:"Appointment"},
{ name:"Ms. Rao", sessions:8, tag:"Sreahbloer"}
]

})

})


// risk


router.get("/risk",(req,res)=>{

res.json({

riskSummary:{
low:580,
moderate:352,
high:208,
total:1140
},

students:[
{ id:"STU-1574", level:"High", date:"30-Sept", dept:"CSE" },
{ id:"STU-1345", level:"High", date:"25-Sept", dept:"CSE" },
{ id:"STU-8321", level:"Moderate", date:"23-Sept", dept:"ME" },
{ id:"STU-6245", level:"Low", date:"22-Sept", dept:"ECE" },
{ id:"STU-2189", level:"Moderate", date:"19-Sept", dept:"BBA" },
{ id:"STU-8912", level:"Low", date:"16-Sept", dept:"ME" },
{ id:"STU-7641", level:"High", date:"14-Sept", dept:"CSE" }
],

riskBreakdown:[
{ name:"Academic Stress", value:385, percent:65 },
{ name:"Sleep Problems", value:605, percent:85 }
]

})

})


// peer support
router.get("/peer-support",(req,res)=>{

res.json({

stats:{
mentors:12,
groups:8,
sessions:34,
rating:4.7
},

peerMentors:[
{ name:"Ananya Sharma", branch:"CSE", year:"3rd Year", rating:4.8, sessions:42, avatar:"ananya", specialty:"Academic Stress", available:true },
{ name:"Rohan Mehta", branch:"ECE", year:"4th Year", rating:4.9, sessions:67, avatar:"rohan", specialty:"Social Anxiety", available:true },
{ name:"Priya Patel", branch:"ME", year:"3rd Year", rating:4.7, sessions:35, avatar:"priya", specialty:"Exam Anxiety", available:false },
{ name:"Arjun Nair", branch:"IT", year:"4th Year", rating:4.6, sessions:28, avatar:"arjun", specialty:"Career Guidance", available:true },
{ name:"Kavya Reddy", branch:"CSE", year:"2nd Year", rating:4.5, sessions:19, avatar:"kavya", specialty:"Peer Conflict", available:false }
],

supportGroups:[
{ name:"Stress Busters Circle", members:24, nextSession:"Today, 5:00 PM", category:"Stress Management", color:"bg-[hsl(var(--arogyam-sky))]" },
{ name:"Mindful Mondays", members:18, nextSession:"Mon, 4:00 PM", category:"Mindfulness", color:"bg-[hsl(var(--arogyam-lavender))]" },
{ name:"Career Compass", members:31, nextSession:"Wed, 6:00 PM", category:"Career Anxiety", color:"bg-[hsl(var(--arogyam-teal)/0.15)]" },
{ name:"Safe Space Talks", members:15, nextSession:"Fri, 3:30 PM", category:"Open Discussion", color:"bg-[hsl(var(--arogyam-coral)/0.15)]" }
],

recentChats:[
{ from:"Ananya S.", message:"Remember, it's okay to take breaks during exams!", time:"2 min ago" },
{ from:"Rohan M.", message:"Great session today. Keep journaling!", time:"1 hr ago" },
{ from:"Arjun N.", message:"Let's schedule a follow-up next week.", time:"3 hrs ago" }
]

})

})


// setting


router.get("/profile", verifyToken, async (req,res)=>{

try{

const admin = await Admin.findById(req.user.userId).select("-password")

res.json(admin)

}catch(err){

res.status(500).json({message:"Profile fetch failed"})

}

})


router.put("/profile", verifyToken, async (req,res)=>{

try{

const {name,email,phone,role,department,campus} = req.body

const admin = await Admin.findByIdAndUpdate(
req.user.userId,
{name,email,phone,role,department,campus},
{new:true}
)

res.json(admin)

}catch(err){

res.status(500).json({message:"Profile update failed"})

}

})

module.exports = router;