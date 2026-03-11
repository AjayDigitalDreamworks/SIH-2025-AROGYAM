const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema definition
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '🎓',
  },
  university: {
    type: String,
    trim: true,
  },
  yearOfStudy: {
    type: String,
    enum: ['1','2','3','4'],
  },
  department: {
    type: String,
    trim: true,
    default: "General",
  },
  section: {
    type: String,
    trim: true,
    default: "A",
  },
  residenceType: {
    type: String,
    enum: ["Hostel", "Day Scholar"],
    default: "Hostel",
  },

  role: {
    type: String,
    enum: ["student", "volunteer"],
    default: "student",
  },
  wellbeingScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 70,
  },
  riskLevel: {
    type: String,
    enum: ["Low", "Moderate", "High"],
    default: "Low",
  },
  riskFactors: [
    {
      type: String,
      trim: true,
    },
  ],
  lastRiskCheckAt: {
    type: Date,
    default: Date.now,
  },
  crisisAlertsCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  emergencyCasesCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  peerMentorProfile: {
    isMentor: { type: Boolean, default: false },
    specialty: { type: String, trim: true, default: "" },
    sessionsHandled: { type: Number, default: 0, min: 0 },
    mentorRating: { type: Number, default: 0, min: 0, max: 5 },
    available: { type: Boolean, default: false },
  },

    moodHistory: [
    {
      date: { type: Date, default: Date.now },
      mood: { type: Number, min: 1, max: 5, required: true },
      notes: { type: String, trim: true },
    },
  ],
  sleepHistory: [
    {
      date: { type: Date, default: Date.now },
      hours: { type: Number, min: 0, max: 24, required: true },
      quality: { type: Number, min: 1, max: 5, required: true },
    },
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  quizScores: [
    {
      score: { type: Number, required: true }, 
      quiz_type: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to compare passwords
// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Make sure we are comparing a valid string
    if (!candidatePassword) {
      throw new Error('No password provided for comparison');
    }

    const match = await bcrypt.compare(candidatePassword, this.password);
    return match;
  } catch (error) {
    throw new Error("Error comparing password: " + error.message);
  }
};


// Pre-save hook to hash password before saving to DB
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// User model creation
const User = mongoose.model('User', UserSchema);
module.exports = User;
