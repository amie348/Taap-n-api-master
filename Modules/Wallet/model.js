const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  currentAmount: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  history: [
    {
      amount: {
        type: Number,
        required: [true, 'Amount is required'],
      },
      description: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        required: [true, 'Type is required'],
        enum: ['DEPOSIT', 'WITHDRAW', 'SPENT'],
      },
      createAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

const WalletModal = mongoose.model('wallets', walletSchema);
module.exports = WalletModal;
