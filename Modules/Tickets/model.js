const Joi = require('joi');
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ticket Name required '],
    minLength: [3, 'minimum length is 3 '],
    maxLength: [255, 'maximum length size is 255'],
  },
  ticketPicture: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    //required: [true, 'Ticket Price required '],
    min: [0, "Price can't be less than 0  "],
    default: 0,
  },
  ticketCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ticketscategories',
    required: [true, 'ticketCategory required '],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'userId required '],
  },
  createAt: {
    type: Date,
    default: new Date(),
  },
  ticketCount: {
    /*total: {
      type: Number,
      default: 0,
    },*/
    sale: {
      type: Number,
      default: 0,
    },
  },
  soldTickets: [
    {
      user: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
          required: [true, 'userId required '],
        },
        userName: {
          type: String,
          required: [true, 'Full Name is required'],
        },
        userPicture: {
          type: String,
          default: null,
        },
      },
      amount: {
        type: Number,
        required: [true, 'Amount is required '],
      },
      createAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

const validateTicketSchema = (ticket) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    content: Joi.string(),
    price: Joi.number().min(0),
    ticketPicture: Joi.string().min(3).max(255),
    userId: Joi.string().min(3).max(255).required(),
    ticketCategory: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(ticket);
};

const TicketModal = mongoose.model('tickets', ticketSchema);
module.exports = TicketModal;
module.exports.validateTicketSchema = validateTicketSchema;
