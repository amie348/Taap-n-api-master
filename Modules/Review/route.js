const { addReview /*, removeReview*/ } = require('./controller');

async function routes(fastify) {
  fastify.post('/', addReview);
  //fastify.delete('/:id', removeReview);
}

module.exports = routes;
