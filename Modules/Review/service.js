const ReviewModal = require('./model');

exports.postReview = async (data) => {
  const review = new ReviewModal(data);
  return await review.save();
};

/*exports.deleteReview = async (_id) => {
  return await ReviewModal.findOneAndDelete({ _id });
};*/
