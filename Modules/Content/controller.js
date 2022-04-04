const { checkUserById } = require('../User/service');
const { deleteFile } = require('../../uploadContent/s3');
const { checkIfValidObjectId } = require('../../db/validData');
const {
  contentById,
  postContent,
  deleteContent /*, getContent*/,
} = require('./service');

const {
  addContentIdToUser,
  removeContentIdToUser,
} = require('../User/service');

exports.addContent = async (request, reply) => {
  const { id } = request.params;
  const { postType, title, access, price = null } = request.body;

  try {
    if (!(await checkIfValidObjectId(id))) {
      return reply.status(200).send({ message: `not valid  object Id` });
    }
    const userExist = await checkUserById(id);
    if (!userExist) {
      return reply
        .status(200)
        .send({ message: `this userId does't exist to get user` });
    }
    if (!request.file.filename) {
      return reply.status(200).send({
        message: 'there is no file in the request ',
      });
    }
    const fileData = {
      type: request.file.mimetype.split('/')[0],
      filePath: `public/${request.file.filename}`,
      postType,
      title,
      access,
      price,
      user: {
        _id: userExist._id,
        userName: `${userExist.firstName} ${userExist.lastName}`,
        userPicture: userExist.profilePicture,
      },
    };

    const result = await postContent(fileData);
    await addContentIdToUser(id, result._id);

    return reply.status(200).send({
      //payload: result,
      message: `${result.type} Uploaded Successfully`,
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};

exports.removeContent = async (request, reply) => {
  const { id } = request.params;
  const { contentId } = request.body;
  try {
    if (!(await checkIfValidObjectId(id))) {
      return reply.status(200).send({ message: `not valid  user Id` });
    }
    if (!(await checkIfValidObjectId(contentId))) {
      return reply.status(200).send({ message: `not valid  content Id` });
    }
    const contentExist = await contentById(contentId);
    if (!contentExist) {
      return reply
        .status(200)
        .send({ message: `there is no such kind of content` });
    }
    const userExist = await checkUserById(id);
    if (!userExist) {
      return reply
        .status(200)
        .send({ message: `there is no user on that data` });
    }
    const removedContent = await deleteContent(contentId);
    if (!removedContent) {
      return reply.status(200).send({
        message: `no content detected`,
      });
    }
    await deleteFile(removedContent.key);
    await removeContentIdToUser(id, removedContent._id);

    return reply.status(200).send({
      message: `${removedContent.type} remove Successfully`,
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};

/*exports.getAllContent = async (request, reply) => {
  try {
    let result = await getContent();
    return reply.status(200).send({
      payload: result,
      message: 'All Content Successfully',
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};
*/
