const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselor', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  discussion: { type: String },
  status: { type: String, enum: ['pending','accepted','rejected','modified','cancelled'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'updatedByModel' },
  updatedByModel: { type: String, enum: ['User','Counselor'] },
  responseNote: { type: String }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
