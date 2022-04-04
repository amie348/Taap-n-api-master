const {
  addTicketCategory,
  removeTicketCategory,
  getAllTicketCategories,
  getTicketCategoryById,
} = require('./controller');

async function routes(fastify) {
  fastify.get('/:id', getTicketCategoryById);
  fastify.get('/', getAllTicketCategories);
  fastify.post('/', addTicketCategory);
  fastify.delete('/:id', removeTicketCategory);
}

module.exports = routes;
