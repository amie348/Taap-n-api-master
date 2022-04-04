const { allTrending } = require('./service');

// get all Trending
exports.getAllTrending = async (request, reply) => {
  const result = await allTrending();
  return reply.status(200).send({ payload: result, message: 'all trending users ' });
};
