const mongoose = require('mongoose');

const ticketCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ticket Categories name required '],
    minLength: [3, 'minimum length is 3 '],
    maxLength: [255, 'maximum length size is 255'],
  },
});

const TicketCategoryModal = mongoose.model(
  'ticketscategories',
  ticketCategorySchema
);
module.exports = TicketCategoryModal;
