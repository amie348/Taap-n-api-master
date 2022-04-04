const mongoose = require('mongoose');

const trendingSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  counter: {
    type: Number,
    default: 0,
  },
  lastUpdate: {
    type: Date,
    default: Date.now(),
  },
});

const TrendingModal = mongoose.model('Trending', trendingSchema);
module.exports = TrendingModal;
