const { uploadPicture } = require('../../uploadContent/multer');
const {
  addTicket,
  removeTicket,
  getAllTickets,
  getTicketById,
} = require('./controller');

async function routes(fastify) {
  //fastify.get('/:id', getTicketById);
  fastify.get('/', getAllTickets);
  fastify.post(
    '/',
    { /*preHandler: handleValidation,*/ preHandler: uploadPicture },
    addTicket
  );
  fastify.delete('/:id', removeTicket);
}

/*const handleValidation = (request, reply, next) => {
  console.log(request.body);
  next();
};*/

module.exports = routes;
