const {
  interestById,
  postInterest,
  deleteInterest,
  allInterest,
} = require('./service');

/*exports.getInterestById = async (request, reply) => {
  try {
    const getInterest = await interestById(request.params.id);
    return reply.status(200).send({
      payload: getInterest,
      message: 'interest',
    });
  } catch (error) {
    return reply.status(500).send({
      message: error,
    });
  }
};

exports.getAllInterests = async (request, reply) => {
  try {
    const result = await allInterest();
    return reply.status(200).send({
      payload: result,
      message: 'all interest',
    });
  } catch (error) {
    return reply.status(500).send({
      message: error,
    });
  }
};

exports.addInterest = async (request, reply) => {
  try {
    let interest = await postInterest(request.body);
    return reply
      .status(200)
      .send({ payload: interest, message: 'interest added Successfully' });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};

exports.removeInterest = async (request, reply) => {
  try {
    let removedInterest = await deleteInterest(request.params.id);
    return reply.status(200).send({
      payload: removedInterest,
      message: 'interest remove Successfully',
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};
*/