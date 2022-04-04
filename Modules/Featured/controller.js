const { allFeatured, handleFeature } = require('./service');

// get all Featured
exports.getAllFeatured = async (request, reply) => {
  const result = await allFeatured();
  return reply
    .status(200)
    .send({ payload: result, message: 'all featured users ' });
};

// handle Featured
exports.handleFeatured = async (request, reply) => {
  const result = await handleFeature(request.params.id);
  return reply.send({
    payload: result.feature,
    message: result.message,
  });
};
