
const mongoose = require('mongoose');

const CounselorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  rating: { type: Number, required: true },
  experience: { type: String, required: true },
  image: { type: String, default: '👩‍⚕️' } // Default emoji for image
});

const Counselor = mongoose.model('Counselor', CounselorSchema);
module.exports = Counselor;