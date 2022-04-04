const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  totalRequests: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  requestType: [
    {
      name: {
        type: String,
        required: [true, 'name is required'],
      },
      price: {
        type: Number,
        required: [true, 'price is required'],
      },
      createAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],

  requestHistory: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      amount: {
        type: Number,
        required: [true, 'Amount is required'],
      },
      name: {
        type: String,
        required: [true, 'Name is required'],
        default: '',
      },
      company: {
        type: String,
        required: [true, 'Company Name is required'],
        default: '',
      },
      description: {
        type: String,
        required: [true, 'Description is required'],
        default: '',
      },
      status: {
        type: Boolean,
        default: false,
      },
      complete: {
        type: Boolean,
        default: false,
      },
      createAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

const RequestModal = mongoose.model('requests', requestSchema);
module.exports = RequestModal;
