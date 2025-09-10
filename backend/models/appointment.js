const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselor', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  discussion: { type: String }
});
const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
