const mongoose = require('mongoose');

const AnonymousProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  aliasName: String,
  avatarUrl: String,
  uniqueId: { type: String, unique: true, immutable: true },
});

module.exports = mongoose.model("Anonymous", AnonymousProfileSchema);