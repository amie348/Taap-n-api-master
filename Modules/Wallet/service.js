const Joi = require('joi');
const WalletModal = require('./model');

exports.createWallet = async () => {
  const wallet = new WalletModal();
  return await wallet.save();
};

exports.addUserIdToWallet = async (id, userId) => {
  await WalletModal.findByIdAndUpdate(
    id,
    {
      $set: {
        userId: userId,
      },
    },
    {
      new: true,
    }
  );
};

exports.getUserWallet = async (userId) => {
  return await WalletModal.find({ userId }).lean().exec();
};

exports.insertDataToWallet = async (userId, data) => {
  const userWallet = await WalletModal.findOne({ userId });

  let updatedAmount = 0;
  let message = '';
  if (data.type !== 'DEPOSIT') {
    updatedAmount = userWallet.currentAmount - data.amount;
    message = `You have USED  ${data.amount}`;
    if (updatedAmount < 0) {
      return { message: `You can't do that action due to your limited amount` };
    }
  } else if (data.type === 'DEPOSIT') {
    updatedAmount = userWallet.currentAmount + data.amount;
    message = `You have DEPOSIT  ${data.amount}`;
  }

  await WalletModal.findOneAndUpdate(
    { userId: userId },
    {
      $push: {
        history: data,
      },
      $set: {
        currentAmount: updatedAmount,
      },
    },
    {
      new: true,
    }
  );
  //console.log(result);
  return { message };
};

/*
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
};*/

const validateTransactionSchema = (transaction) => {
  const schema = Joi.object({
    amount: Joi.number().integer().min(0).required(),
    description: Joi.string().max(255),
    type: Joi.string()
      .valid('DEPOSIT', 'WITHDRAW', 'SPENT')
      .min(3)
      .max(255)
      .required(),
  });
  return schema.validate(transaction);
};

module.exports.validateTransactionSchema = validateTransactionSchema;
