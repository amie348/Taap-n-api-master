const { getAllTrending } = require('./controller');

async function routes(fastify) {
  fastify.get('/', getAllTrending);
}

module.exports = routes;
