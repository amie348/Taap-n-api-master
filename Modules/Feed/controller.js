//const { getFeedData } = require('../User/service');
const { getFeedData } = require('../Content/service');

exports.getAllFeeds = async (request, reply) => {
  //const { id } = request.params;
  //const { limit, skip } = request.query;
  //console.log(id, limit, skip);
  try {
    const feedResult = await getFeedData();
    console.log(feedResult.length);
    if (!feedResult.length) {
      return reply.status(200).send({
        message: 'No public video Content by any user to show ',
      });
    }
    return reply.status(200).send({
      payload: feedResult,
      message: 'Public video content by random users',
    });
  } catch (error) {
    return reply.status(200).send({
      message: error,
    });
  }
};
