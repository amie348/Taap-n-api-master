const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require(`moment`);

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'firstName required '],
    minLength: [3, 'minimum length is 3 '],
    maxLength: [255, 'maximum length size is 255'],
  },
  lastName: {
    type: String,
    required: [true, 'lastName required '],
    minLength: [3, 'minimum length is 3 '],
    maxLength: [255, 'maximum length size is 255'],
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'password required '],
    minLength: [7, 'minimum length is 7 '],
    maxLength: [255, 'maximum length size is 255'],
  },
  address: {
    type: String,
    required: [true, 'address required '],
    minLength: [3, 'minimum length is 3 '],
    maxLength: [255, 'maximum length size is 255'],
  },
  phoneNumber: {
    type: String,
  },
  bio: {
    type: String,
    default: '',
  },
  companyName: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reviews',
    },
  ],
  interests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'interest',
    },
  ],
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'request',
    },
  ],
  content: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'contents',
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
  subscribeBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
  subscribeTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
  subscribeHistory:[
    {
      _id: false,
      status:{
        type: String,
        required: true,
      },
      subscriber:{
        type: mongoose.Types.ObjectId,
        required: true
      },
      date: {
        type: String,
        default: moment().format("L")
      }
    }
  ],
  resetCode: {
    type: Number,
    default: null,
  },
  isCelebratory: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'wallets',
    required: [true, 'WalletId is required'],
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'requests',
    required: [true, 'RequestId is required'],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

/*const validateUserSchema = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(255).required(),
    lastName: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).max(255).required(),
    address: Joi.string().min(3).max(255).required(),
    phoneNumber: Joi.string().min(9).max(13).required(),
  });
  return schema.validate(user);
};*/
//module.exports.validateUserSchema = validateUserSchema;

const UserModal = mongoose.model('users', userSchema);

module.exports = UserModal;
