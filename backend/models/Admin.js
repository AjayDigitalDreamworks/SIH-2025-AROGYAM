const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  department: { type: String, default: 'Student Wellness' },
  campus: { type: String, default: 'Main Campus' }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
