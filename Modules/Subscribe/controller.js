const { handleSubscribe } = require('../User/service');

exports.subscribeUser = async (request, reply) => {
  const { subscribeBy, subscribeTo } = request.body;
  try {
    const subscribeResult = await handleSubscribe(subscribeBy, subscribeTo);
    return reply.status(200).send({
      payload: subscribeResult,
      message: `Subscribe to  ${subscribeResult.subscribeTo}`,
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};
