const {
  ticketCategoryById,
  postTicketCategory,
  deleteTicketCategory,
  allTicketCategories,
} = require('./service');

exports.getTicketCategoryById = async (request, reply) => {
  try {
    const singleCategory = await ticketCategoryById(request.params.id);
    return reply.status(200).send({
      payload: singleCategory,
      message: 'category Name based on ID',
    });
  } catch (error) {
    return reply.status(200).send({ message: error });
  }
};

exports.getAllTicketCategories = async (request, reply) => {
  try {
    const result = await allTicketCategories();
    return reply.status(200).send({
      payload: result,
      message: 'all Tickets Categories',
    });
  } catch (error) {
    return reply.status(200).send({ message: error });
  }
};

exports.addTicketCategory = async (request, reply) => {
  try {
    let result = await postTicketCategory(request.body);
    return reply
      .status(200)
      .send({ payload: result, message: 'ticket Category added Successfully' });
  } catch (error) {
    return reply.status(200).send({ message: error.message });
  }
};

exports.removeTicketCategory = async (request, reply) => {
  try {
    let removedTicketCategory = await deleteTicketCategory(request.params.id);
    return reply.status(200).send({
      //payload: removedTicketCategory,
      message: `${removedTicketCategory.name} removed Successfully`,
    });
  } catch (error) {
    return reply.status(200).send({ message: error.message });
  }
};
