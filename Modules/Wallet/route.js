const {
  addInterest,
  removeInterest,
  getAllInterests,
  getInterestById,
} = require('./controller');

async function routes(fastify) {
  fastify.get('/:id', getInterestById);
  fastify.get('/', getAllInterests);
  fastify.post('/', addInterest);
  fastify.delete('/:id', removeInterest);
}

module.exports = routes;
