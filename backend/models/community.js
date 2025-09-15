const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: Date,
});

module.exports = mongoose.model('Community', CommunitySchema);