const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  uniqueId: {
    type: String,
    required: [true, 'uniqueId required '],
    minLength: [3, 'minimum length is 3 '],
    maxLength: [255, 'maximum length size is 255'],
  },
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'both user ids required '],
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'both user ids required '],
  },
  lastMessage: {
    type: String,
    default: '',
  },
  lastUpdate: {
    type: Date,
    default: new Date(),
  },
});

const InterestModal = mongoose.model('chats', interestSchema);
module.exports = InterestModal;
