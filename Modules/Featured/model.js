const mongoose = require('mongoose');

const featuredSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const FeaturedModal = mongoose.model('featured', featuredSchema);
module.exports = FeaturedModal;
