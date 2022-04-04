const TicketCategoryModal = require('./model');

exports.postTicketCategory = async (data) => {
  const interest = new TicketCategoryModal(data);
  return await interest.save();
};

exports.ticketCategoryById = async (id) => {
  return await TicketCategoryModal.find({ _id: id }).lean().exec();
};

exports.allTicketCategories = async () => {
  return TicketCategoryModal.find().lean().exec();
};

exports.deleteTicketCategory = async (_id) => {
  return await TicketCategoryModal.findOneAndDelete({ _id });
};
