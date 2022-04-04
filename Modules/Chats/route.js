const { postChat, updateChat, getAllUsersChats } = require('./controller');

async function routes(fastify) {
  fastify.post('/', postChat);
  fastify.put('/:id', updateChat);
  fastify.get('/', getAllUsersChats);
}
module.exports = routes;
