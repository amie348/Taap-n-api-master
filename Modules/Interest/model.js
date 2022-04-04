const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Interest name required '],
    minLength: [3, 'minimum length is 3 '],
    maxLength: [255, 'maximum length size is 255'],
  },
});

const InterestModal = mongoose.model('interest', interestSchema);
module.exports = InterestModal;
