
const mongoose = require('mongoose');

const CounselorSchema = new mongoose.Schema({
  // Authentication fields
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed password

  // Domain-specific fields
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  rating: { type: Number, default: 0 },
  experience: { type: String, required: true },
  image: { type: String, default: '👩‍⚕️' }, // Default emoji for image

  // Authentication & status
  role: { type: String, default: 'counsellor' },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

const Counselor = mongoose.model('Counselor', CounselorSchema);
module.exports = Counselor;