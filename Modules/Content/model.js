const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Content Type required '],
  },
  url: {
    type: String,
    required: [true, 'Content url required '],
  },
  title: {
    type: String,
    required: [true, 'title is required '],
  },
  access: {
    type: String,
    required: [true, 'Access type is required'],
    enum: ['public', 'private', 'subscribe'],
  },
  postType: {
    type: String,
    required: [true, 'postType is required'],
    enum: ['post', 'story'],
  },
  price: {
    type: Number,
    default: null,
  },
  key: {
    type: String,
    required: [true, 'Content Key required '],
  },
  user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'userId required '],
    },
    userName: {
      type: String,
      required: [true, 'Full Name is required'],
    },
    userPicture: {
      type: String,
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ContentModal = mongoose.model('contents', contentSchema);
module.exports = ContentModal;
