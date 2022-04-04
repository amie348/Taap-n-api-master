const RemovedContentModal = require('./model');

exports.removedContentSaved = async (data) => {
  try {
    const dataSaved = new RemovedContentModal({
      content: data
    });
    await dataSaved.save();
  } catch (error) {
    return error;
  }
};