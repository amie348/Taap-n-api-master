const { uploadPicture } = require('../../uploadContent/multer');
const { /*getAllContent,*/ addContent, removeContent } = require('./controller');

async function routes(fastify) {
  //fastify.get('/', getAllContent);
  fastify.put('/:id', { preHandler: uploadPicture }, addContent);
  fastify.delete('/:id', removeContent);
}

module.exports = routes;
