const ChatModel = require('./model');

exports.startNewChat = async (data) => {
  const chat = await ChatModel.findOne({
    uniqueId: data.uniqueId,
    user1: data.user1,
    user2: data.user2,
  });
  if (chat) {
    return {
      payload: chat,
      message: 'there is already chat between these users',
    };
  }
  const newChat = new ChatModel(data);
  const newUser = await newChat.save();
  return { payload: newChat, message: 'created new Chat' };
};

exports.updateChatById = async (id, updatedChat) => {
  const updated = await ChatModel.findByIdAndUpdate(
    id,
    {
      $set: {
        lastMessage: updatedChat.lastMessage,
        lastUpdate: updatedChat.lastUpdate,
      },
    },
    {
      new: true,
    }
  );
  return updated;
};

exports.getAllChats = async () => {
  const allData = await ChatModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user1',
        foreignField: '_id',
        as: 'user1',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user2',
        foreignField: '_id',
        as: 'user2',
      },
    },
    {
      $unwind: { path: '$user1' },
    },
    {
      $unwind: { path: '$user2' },
    },
    {
      $project: {
        _id: 1,
        lastMessage: 1,
        lastUpdate: 1,
        uniqueId: 1,

        'user1._id': 1,
        'user1.firstName': 1,
        'user1.lastName': 1,
        //'user1.profilePicture': 1,

        'user2._id': 1,
        'user2.firstName': 1,
        'user2.lastName': 1,
        //'user2.profilePicture': 1,
      },
    },
  ]).exec();
  return allData;
};
