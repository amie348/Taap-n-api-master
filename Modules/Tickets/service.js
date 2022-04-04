const mongoose = require('mongoose');
const TicketModal = require('./model');

exports.checkTicketById = async (_id) => {
  return await TicketModal.findOne({ _id });
};

exports.ticketById = async (id) => {
  return await TicketModal.findOne({ _id: id }).lean().exec();
};

//create new ticket by user
exports.postTicket = async (data) => {
  const interest = new TicketModal(data);
  return await interest.save();
};

// all tickets to buy
exports.allTickets = async () => {
  const pipeLine = [
    {
      $lookup: {
        from: 'ticketscategories',
        localField: 'ticketCategory',
        foreignField: '_id',
        as: 'ticketCategory',
      },
    },
    {
      $unwind: {
        path: '$ticketCategory',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
      },
    },
    {
      $project: {
        _id: 1,
        ticketPicture: 1,
        price: 1,
        name: 1,
        createAt: 1,
        'ticketCategory._id': 1,
        'ticketCategory.name': 1,
        //soldTickets: 1,
        ticketCount: 1,
        'user._id': 1,
        'user.firstName': 1,
        'user.lastName': 1,
        'user.profilePicture': 1,
        'user.isCelebratory': 1,
      },
    },
  ];

  return TicketModal.aggregate(pipeLine).exec();
};

//delete ticket by user
exports.deleteTicket = async (_id) => {
  return await TicketModal.findOneAndDelete({ _id });
};

//buy a ticket
exports.buyTicketByUser = async (id, data) => {
  return await TicketModal.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        soldTickets: data,
      },
      $inc: { 'ticketCount.sale': 1 },
    },
    {
      new: true,
    }
  );
};

// get user purchased all tickets
exports.getUserPurchasedTickets = async (id) => {
  const pipeLine = [
    {
      $match: {
        'soldTickets.user._id': new mongoose.Types.ObjectId(id),
      },
    },
    {
      $unwind: {
        path: '$soldTickets',
      },
    },
    {
      $match: {
        'soldTickets.user._id': new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'ticketscategories',
        localField: 'ticketCategory',
        foreignField: '_id',
        as: 'ticketCategory',
      },
    },
    {
      $unwind: {
        path: '$ticketCategory',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
      },
    },
    {
      $project: {
        _id: 1,
        ticketPicture: 1,
        price: 1,
        name: 1,
        createAt: 1,
        'ticketCategory._id': 1,
        'ticketCategory.name': 1,
        //soldTickets: 1,
        ticketCount: 1,
        'user._id': 1,
        'user.firstName': 1,
        'user.lastName': 1,
        'user.profilePicture': 1,
        'user.isCelebratory': 1,
      },
    },
  ];

  return TicketModal.aggregate(pipeLine).exec();
};

// get user created all tickets against specific user
exports.getUserCreatedTickets = async (id) => {
  const pipeLine = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'ticketscategories',
        localField: 'ticketCategory',
        foreignField: '_id',
        as: 'ticketCategory',
      },
    },
    {
      $unwind: {
        path: '$ticketCategory',
      },
    },
  ];

  return TicketModal.aggregate(pipeLine).exec();
};
