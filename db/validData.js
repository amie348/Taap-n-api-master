const mongoose = require('mongoose');

exports.checkIfValidObjectId = async (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
