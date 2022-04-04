const { getAllFeeds } = require('./controller');

async function routes(fastify) {
  fastify.get('/', getAllFeeds);
}

module.exports = routes;
