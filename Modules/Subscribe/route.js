const { subscribeUser } = require('./controller');

async function routes(fastify) {
  fastify.post('/', subscribeUser);
}

module.exports = routes;
