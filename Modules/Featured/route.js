const { getAllFeatured, handleFeatured } = require('./controller');

async function routes(fastify) {
  fastify.get('/', getAllFeatured);
  fastify.put('/:id', handleFeatured);
}

module.exports = routes;
