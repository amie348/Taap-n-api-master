const Joi = require('joi');
const RequestModal = require('./model');

exports.createRequestDataForNewUser = async () => {
  const requestType = [
    {
      name: 'Face Time',
      price: 10,
      createAt: new Date(),
    },
    {
      name: 'Video',
      price: 10,
      createAt: new Date(),
    },
    {
      name: 'Autograph',
      price: 10,
      createAt: new Date(),
    },
    {
      name: 'Merchandise',
      price: 10,
      createAt: new Date(),
    },
  ];
  const requestData = new RequestModal({ requestType });
  return await requestData.save();
};

exports.addUserIdToRequest = async (id, userId) => {
  await RequestModal.findByIdAndUpdate(
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

exports.getUserServices = async (userId) => {
  return await RequestModal.find({ userId }, { requestHistory: 0 })
    .lean()
    .exec();
};

exports.postUserService = async (userId, data) => {
  await RequestModal.findOneAndUpdate(
    { userId },
    {
      $push: {
        requestType: data,
      },
    },
    {
      new: true,
    }
  );
};

exports.changeUserService = async (userId, data) => {
  let result = await RequestModal.findOne(
    { userId },
    { requestType: 1, _id: 0 }
  );

  const updatedServices = result.requestType.map((item) => {
    if (item._id == data.serviceId) {
      return {
        createdAt: new Date(),
        _id: item._id,
        name: item.name,
        price: data.price,
      };
    }
    return item;
  });

  return await RequestModal.findOneAndUpdate(
    { userId },
    {
      $set: {
        requestType: updatedServices,
      },
    },
    {
      new: true,
    }
  );
};

exports.removeUserServices = async (userId, data) => {
  let result = await RequestModal.findOne(
    { userId },
    { requestType: 1, _id: 0 }
  );

  const updatedServices = result.requestType.filter((item) => item._id != data);

  await RequestModal.findOneAndUpdate(
    { userId },
    {
      $set: {
        requestType: updatedServices,
      },
    },
    {
      new: true,
    }
  );
};

/*exports.getUserWallet = async (userId) => {
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
};

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
*/

//module.exports.validateTransactionSchema = validateTransactionSchema;
