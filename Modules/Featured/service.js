const FeaturedModal = require('./model');
const { getAverageRating } = require('../../utils/averagingRating');

exports.handleFeature = async (userId) => {
  const found = await FeaturedModal.findOne({ userId }).exec();
  let bc;
  if (!found) {
    const addFeature = new FeaturedModal({ userId });
    const feature = await addFeature.save();
    return { feature, message: 'user have been featured' };
  }
  const feature = await FeaturedModal.findOneAndRemove(userId);
  return { feature, message: 'user have been removed from featured list' };
};

exports.allFeatured = async () => {
  let users = await FeaturedModal.find()
    .populate({
      path: 'userId',
      select: {
        firstName: 1,
        lastName: 1,
        isCelebratory: 1,
        review: 1,
        profilePicture: 1,
      },
      populate: {
        path: 'review',
        select: { rating: 1 },
      },
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .exec();

  users = users.filter(item => item.userId !== null)
    
  users = users.map((v) => ({
    counter: v.counter,
    lastUpdate: v.lastUpdate,
    _id: v._id,
    user: {
      _id: v.userId._id,
      firstName: v.userId.firstName,
      lastName: v.userId.lastName,
      isCelebratory: v.userId.isCelebratory,
      profilePicture: v.userId.profilePicture,
      rating: {
        totalReview: v.userId.review.length,
        avgRating: getAverageRating(v.userId.review, v.userId.review.length),
      },
    },
  }));

  return users;
};
