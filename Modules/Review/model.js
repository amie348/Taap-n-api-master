const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: String,
    required: [true, 'Rating required '],
  },
  reviewBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'reviewBy userId required '],
  },
  reviewFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'reviewFor userId required '],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ReviewModal = mongoose.model('reviews', reviewSchema);
module.exports = ReviewModal;
