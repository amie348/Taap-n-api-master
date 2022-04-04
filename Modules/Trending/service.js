const TrendingModal = require('./model');
const {
  getAverageRating
} = require('../../utils/averagingRating');

exports.updateTrend = async (userId) => {
  const result = await TrendingModal.findOne({
    userId
  }).lean().exec();
  if (!result) {
    const trend = new TrendingModal({
      userId,
      counter: 1
    });
    return await trend.save();
  }
  return await TrendingModal.findByIdAndUpdate(
    result._id, {
      $inc: {
        counter: 1
      },
    }, {
      new: true,
    }
  );
};

exports.allTrending = async () => {
  let users = await TrendingModal.find().populate({
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
        select: {
          rating: 1
        },
      },
    })
    .sort({
      counter: -1
    })
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