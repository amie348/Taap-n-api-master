const { validateTicketSchema } = require('./model');
const { checkUserById } = require('../User/service');
const { uploadFile } = require('../../uploadContent/s3');
const { ticketCategoryById } = require('../TicketsCategory/service');

const {
  checkTicketById,
  ticketById,
  postTicket,
  deleteTicket,
  allTickets,
} = require('./service');

exports.getTicketById = async (request, reply) => {
  try {
    const ticketData = await ticketById(request.params.id);
    return reply.status(200).send({
      payload: ticketData,
      message: 'ticketData based on Ticket ID',
    });
  } catch (error) {
    return reply.status(500).send({
      message: error,
    });
  }
};

exports.getAllTickets = async (request, reply) => {
  try {
    const result = await allTickets();
    return reply.status(200).send({
      payload: result,
      message: 'all Tickets',
    });
  } catch (error) {
    return reply.status(500).send({
      message: error,
    });
  }
};

exports.addTicket = async (request, reply) => {
  try {
    const { error } = validateTicketSchema(request.body);
    if (error) {
      return reply.status(200).send({ message: error.details[0].message });
    }
    const ticketCategoryExist = await ticketCategoryById(
      request.body.ticketCategory
    );
    if (!ticketCategoryExist) {
      return reply.status(200).send({
        message: `Invalid Ticket Category`,
      });
    }

    const userExist = await checkUserById(request.body.userId);
    if (!userExist) {
      return reply.status(200).send({
        message: `Invalid UserId`,
      });
    }

    // go through this check
    let url = null;
    if (request.file.filename) {
      const fileData = {
        filePath: `public/${request.file.filename}`,
      };
      const uploadedFile = await uploadFile(fileData);
      url = uploadedFile.Location;
    }

    const updatedData = { ...request.body, ticketPicture: url };
    let result = await postTicket(updatedData);

    const ticket = {
      name: result.name,
      price: result.price,
      ticketPicture: result.ticketPicture,
    };
    return reply.status(200).send({
      payload: ticket,
      message: ` ${ticket.name} Created Successfully`,
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};

exports.removeTicket = async (request, reply) => {
  try {
    const ticketExist = await checkTicketById(request.params.id);
    if (!ticketExist) {
      return reply.status(200).send({
        message: `There is no ticket on that id`,
      });
    }
    let removedTicket = await deleteTicket(request.params.id);
    return reply.status(200).send({
      message: `${removedTicket.name} removed Successfully`,
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};
