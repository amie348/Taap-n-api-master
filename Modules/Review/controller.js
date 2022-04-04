const { addReviewsToUser } = require('../User/service');
const { postReview /*, deleteReview*/ } = require('./service');

exports.addReview = async (request, reply) => {
  try {
    let review = await postReview(request.body);
    await addReviewsToUser(review.reviewFor, review._id);
    return reply.status(200).send({
      payload: review,
      message: 'Review added Successfully',
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};

/*exports.removeReview = async (request, reply) => {
  try {
    let removedReview = await deleteReview(request.params.id);
    return reply.status(200).send({
      payload: removedReview,
      message: 'Review remove Successfully',
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};*/
