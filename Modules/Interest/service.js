const InterestModal = require('./model');

exports.interestById = async (id) => {
  return await InterestModal.find({ _id: id }).lean().exec();
};

exports.allInterest = async () => {
  return InterestModal.find().lean().exec();
};

exports.postInterest = async (data) => {
  const interest = new InterestModal(data);
  return await interest.save();
};

exports.deleteInterest = async (_id) => {
  return await InterestModal.findOneAndDelete({ _id });
};
