require('dotenv').config();
const db = require('./db');
const env = require('./configs');
const buildApp = require('./fastify');
const { bootStrap } = require('./bootstrap');

// Port
const port = env.PORT || 5000;
const prod = env.PORT || 5000;

// Run the server!
const start = async () => {
  const fastify = await buildApp();
  try {
    await db();

    //await bootStrap();
    if (process.env.NODE_ENV == 'production') {
      console.log(process.env.NODE_ENV, 'hello');
      await fastify.listen(port, '0.0.0.0');
    } else {
      await fastify.listen(port);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
