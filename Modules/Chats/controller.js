const mongoose = require('mongoose');
const { startNewChat, updateChatById, getAllChats } = require('./service');

// create chat
exports.postChat = async (request, reply) => {
  try {
    const result = await startNewChat(request.body);
    return reply
      .status(200)
      .send({ payload: result.payload, message: result.message });
  } catch (error) {
    return error;
  }
};

// Update last message of chat
exports.updateChat = async (request, reply) => {
  const { id } = request.params;

  const result = await updateChatById(id, request.body);
  return reply
    .status(201)
    .send({ payload: result, message: 'last message updated ' });
};

// Get All Chats
exports.getAllUsersChats = async (request, reply) => {
  let result = await getAllChats();
  return reply.status(200).send({ payload: result, messages: 'all chat ' });
};
