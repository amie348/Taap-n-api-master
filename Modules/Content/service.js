const ContentModal = require('./model');
const { uploadFile } = require('../../uploadContent/s3');

exports.contentById = async (id) => {
  return await ContentModal.findOne({ _id: id }).lean().exec();
};

exports.postContent = async (data) => {
  const result = await uploadFile(data);
  const imagesData = {
    ...data,
    url: result.Location,
    key: result.Key,
  };
  const content = new ContentModal(imagesData);
  return await content.save();
};

exports.deleteContent = async (_id) => {
  return await ContentModal.findOneAndDelete({ _id });
};

exports.getFeedData = async () => {
  return await ContentModal.find({ access: 'public', type: 'video' });
};
