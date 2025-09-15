// models/Volunteer.js
const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  volunteerId: {
    type: String,
    required: true,
    unique: true
  },
  display_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: String,
  canCreateCommunity: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
