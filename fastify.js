const path = require('path');
const Fastify = require('fastify');
const CorsPlugin = require('fastify-cors');
const multiPart = require('fastify-multipart');
const fastifyStatic = require('fastify-static');
const fastifyCompress = require('fastify-compress');

const Feed = require('./Modules/Feed/route');
const User = require('./Modules/User/route');
const Role = require('./Modules/Role/route');
const Chat = require('./Modules/Chats/route');
const Review = require('./Modules/Review/route');
const Tickets = require('./Modules/Tickets/route');
const Content = require('./Modules/Content/route');
const Featured = require('./Modules/Featured/route');
const Interest = require('./Modules/Interest/route');
const Trending = require('./Modules/Trending/route');
const Subscribe = require('./Modules/Subscribe/route');
const TicketsCategory = require('./Modules/TicketsCategory/route');

const { PUBLIC_FOLDER_NAME } = require('./utils/constants');

async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });
  fastify.register(CorsPlugin, {
    origin: true,
  });
  fastify.register(multiPart);

  fastify.register(fastifyCompress, {
    encodings: ['deflate', 'gzip'],
    threshold: 1024,
  });

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, PUBLIC_FOLDER_NAME),
    prefix: '/public/',
    decorateReply: false,
  });

  fastify.get('/', (request, replay) => {
    replay.status(200).send({
      message: 'welcome to TANP-N api',
    });
  });

  fastify.register(User, {
    prefix: 'api/users',
  });
  fastify.register(Role, {
    prefix: 'api/roles',
  });
  fastify.register(Trending, {
    prefix: 'api/trending',
  });
  fastify.register(Interest, {
    prefix: 'api/interests',
  });
  fastify.register(Review, {
    prefix: 'api/reviews',
  });
  fastify.register(Featured, {
    prefix: 'api/featured',
  });
  fastify.register(Content, {
    prefix: 'api/content',
  });
  fastify.register(Subscribe, {
    prefix: 'api/subscribe',
  });
  fastify.register(Feed, {
    prefix: 'api/feed',
  });
  fastify.register(Chat, {
    prefix: 'api/chats',
  });
  fastify.register(TicketsCategory, {
    prefix: 'api/tickets-category',
  });
  fastify.register(Tickets, {
    prefix: 'api/tickets',
  });
  return fastify;
}

module.exports = buildApp;
