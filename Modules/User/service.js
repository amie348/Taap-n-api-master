const _ = require('lodash');
const mongoose = require('mongoose');
const UserModal = require('./model');
const {
  removedContentSaved
} = require('../DeletedRecord/service');

const {
  hashed
} = require('../../utils/bcrypt');
const {
  interestById
} = require('../Interest/service');
const {
  getAverageRating
} = require('../../utils/averagingRating');

exports.checkUserByEmail = async (email) => {
  return await UserModal.findOne({
    email
  }).lean().exec();
};

exports.checkUserById = async (_id) => {
  return await UserModal.findOne({
    _id
  });
};

exports.addUser = async (data, wallet, request, resetCode) => {
  const hashedPassword = await hashed(data.password);
  const userData = {
    ...data,
    password: hashedPassword,
    wallet,
    request,
    resetCode,
  };
  try {
    const user = new UserModal(userData);
    return await user.save();
  } catch (error) {
    return error;
  }
};

exports.allUsers = async () => {
  return await UserModal.find({}, {
    _id: 1,
    createAt: 1,
    firstName: 1,
    lastName: 1,
    //email: 1, 
    //password: 1,
    //address: 1,
    //phoneNumber: 1,
    isVerified: 1,
    isCelebratory: 1,
    profilePicture: 1,
    //subscribeBy: 1,
  }).exec();
};

exports.getUser = async (id) => {
  return await UserModal.findOne({_id: id}, {subscribeHistory: false})
    .populate({
      path:'role',
       select: {
         role:1
        }
      })
    .populate({
      path: 'review',
      select: {
        reviewFor: 0,
        __v: 0
      },
      populate: {
        path: 'reviewBy',
        select: {
          firstName: 1,
          lastName: 1,
          isCelebratory: 1,
          _id: 0
        },
      },
    })
    .populate({
      path: 'content',
      select: {
        key: 0,
        __v: 0
      },
    })
    .populate({
      path: 'interests',
      select: {
        __v: 0
      },
    })
    .populate({
      path: 'favorites',
      select: {
        firstName: 1,
        lastName: 1,
        isCelebratory: 1,
        _id: 1,
        phoneNumber: 1,
      },
    })
    .exec();
};

exports.removeUser = async (id) => {
  const data = await UserModal.findOneAndDelete({
    _id: id
  });
  await removedContentSaved(data);
  return data;
};

// update user Profile Picture by user Id
exports.userProfilePicture = async (id, pictureUrl) => {
  await UserModal.findByIdAndUpdate(
    id, {
      $set: {
        profilePicture: pictureUrl,
      },
    }, {
      new: true,
    }
  );
};

// update email code
exports.updateEmailCode = async (id, resetCode) => {
  await UserModal.findByIdAndUpdate(
    id, {
      $set: {
        resetCode: resetCode,
      },
    }, {
      new: true,
    }
  );
};

// update email code
exports.updatePassword = async (id, password) => {
  const hashedPassword = await hashed(password);
  await UserModal.findByIdAndUpdate(
    id, {
      $set: {
        password: hashedPassword,
      },
    }, {
      new: true,
    }
  );
};

// update user Data by user Id
exports.updateUserProfile = async (id, data) => {
  return await UserModal.findByIdAndUpdate(id, data, {
    new: true,
  });
};

//********************************************** */
//Interests

//all Users For Interest
exports.allUsersForInterest = async (id) => {
  let result = await UserModal.find({
      interests: id
    }, {
      firstName: 1,
      lastName: 1,
      isCelebratory: 1,
      review: 1,
      profilePicture: 1,
    })
    .populate({
      path: 'review',
      select: {
        rating: 1,
        _id: 0,
      },
    })
    //.sort({ counter: -1 })
    .limit(10)
    .exec();

  const users = result.map((v) => ({
    _id: v._id,
    firstName: v.firstName,
    lastName: v.lastName,
    isCelebratory: v.isCelebratory,
    profilePicture: v.profilePicture,
    rating: {
      totalReview: v.review.length,
      avgRating: getAverageRating(v.review, v.review.length),
    },
  }));
  return users;
};

//user all interests
exports.userInterests = async (id) => {
  const userInterest = [{
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'interests',
        localField: 'interests',
        foreignField: '_id',
        as: 'interests',
      },
    },
    {
      $project: {
        interests: 1,
        _id: 0
      },
    },
  ];
  const result = await UserModal.aggregate(userInterest).exec();
  return result[0].interests;
};

//handle user interest
exports.handleUserInterests = async (id, interestId) => {
  const user = await UserModal.findById(id).exec();
  let interestArray = [...user.interests];
  const found = interestArray.find((element) =>
    interestId.includes(element) ? true : false
  );
  let message = '';
  if (found) {
    interestArray = interestArray.filter((item) => item != interestId);
    message = 'interest has been removed from your Interests';
  } else {
    interestArray.push(interestId);
    message = 'interest has been added to your Interests';
  }
  await UserModal.findByIdAndUpdate(
    id, {
      $set: {
        interests: interestArray,
      },
    }, {
      new: true,
    }
  );
  const handleInterest = await interestById(interestId);
  return {
    interest: {
      name: handleInterest[0].name,
    },
    message: message,
  };
};

/************************************************************* */
// Favorites
// user favorites
exports.userAllFavorites = async (id) => {
  const userInterest = [{
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'favorites',
        foreignField: '_id',
        as: 'favoriteUsers',
      },
    },
    {
      $project: {
        'favoriteUsers._id': 1,
        'favoriteUsers.firstName': 1,
        'favoriteUsers.lastName': 1,
        'favoriteUsers.address': 1,
        'favoriteUsers.phoneNumber': 1,
        'favoriteUsers.isCelebratory': 1,
        _id: 0,
      },
    },
  ];
  return await UserModal.aggregate(userInterest).exec();
};

//handle User Favorites
exports.handleUserFavorites = async (id, favoriteUserId) => {
  let user = await UserModal.findOne({
    _id: id
  }).exec();
  console.log(user);
  let favoriteArray = user.favorites;
  const found = favoriteArray.find((element) =>
    favoriteUserId.includes(element) ? true : false
  );
  let message = '';
  if (found) {
    favoriteArray = favoriteArray.filter((item) => item != favoriteUserId);
    message = 'user has been removed from your favorite list';
  } else {
    favoriteArray.push(favoriteUserId);
    message = 'user has been added to your favorite list';
  }
  await UserModal.findByIdAndUpdate(
    id, {
      $set: {
        favorites: favoriteArray,
      },
    }, {
      new: true,
    }
  );
  user = await UserModal.findOne({
    _id: favoriteUserId
  }).exec();
  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      isCelebratory: user.isCelebratory,
    },
    message: message,
  };
};

/************************************************************* */
// Reviews
//add reviewId to user
exports.addReviewsToUser = async (id, reviewId) => {
  await UserModal.findByIdAndUpdate(
    id, {
      $push: {
        review: reviewId,
      },
    }, {
      new: true,
    }
  );
};

//get user all review
exports.userAllReviews = async (id) => {
  return await UserModal.find({
    _id: id
  }, {
    review: 1
  }).populate({
    path: 'review',
    select: {
      reviewFor: 0,
      __v: 0
    },
    populate: {
      path: 'reviewBy',
      select: {
        firstName: 1,
        lastName: 1,
        isCelebratory: 1,
        _id: 1
      },
    },
  });
};

/************************************************************* */
// Content
//add contentId to user
exports.addContentIdToUser = async (id, contentId) => {
  return await UserModal.findByIdAndUpdate(
    id, {
      $push: {
        content: contentId,
      },
    }, {
      new: true,
    }
  );
};

//remove contentId from user
exports.removeContentIdToUser = async (id, contentId) => {
  const user = await UserModal.findById(id).exec();
  let contentArray = [...user.content];
  contentArray = contentArray.filter((item) => {
    return !_.isEqual(item, contentId);
  });
  return await UserModal.findByIdAndUpdate(
    id, {
      $set: {
        content: contentArray,
      },
    }, {
      new: true,
    }
  );
};

/****************************************************************** */
// Content
//get user all Content
exports.userContent = async (id) => {
  return await UserModal.find({
    _id: id
  }, {
    content: 1
  }).populate({
    path: 'content',
    select: {
      __v: 0
    },
  });
};

/************************************************************* */
// Subscribe
//handle Subscribe
exports.handleSubscribe = async (subscribeById, subscribeToId) => {
  //update subscribeBy user Data
  const subscribeByUser = await UserModal.findByIdAndUpdate({
    _id: subscribeById
  }, {
    $push: {
      subscribeTo: subscribeToId,
    },
  }, {
    new: true,
  });

  //update subscribeTo user Data
  const subscribeToUser = await UserModal.findByIdAndUpdate({
    _id: subscribeToId
  }, {
    $push: {
      subscribeBy: subscribeById,
      subscribeHistory: {status: `subscribed`, subscriber: subscribeById}
    },
  }, {
    new: true,
  });

  return {
    subscribeBy: `${subscribeByUser.firstName} ${subscribeByUser.lastName}`,
    subscribeTo: `${subscribeToUser.firstName} ${subscribeToUser.lastName}`,
  };
};

exports.getStatistics = async(userId) => {
    
  console.log('userId------------------',userId)

  const pipeline = [
  {
  '$facet': {
    'gainedSubscribers': [
      {
        '$match': {
          '_id': mongoose.Types.ObjectId(userId)
        }
      }, {
        '$project': {
          'subscribeHistory': 1
        }
      }, {
        '$unwind': {
          'path': '$subscribeHistory'
        }
      }, {
        '$match': {
          'subscribeHistory.status': 'subscribed'
        }
      }, {
        '$group': {
          '_id': {
            '_id': '$_id', 
            'date': '$subscribeHistory.date'
          }, 
          'total': {
            '$sum': 1
          }
        }
      }, {
        '$project': {
          '_id': '$_id._id', 
          'date': '$_id.date', 
          'total': '$total'
        }
      }, {
        '$sort': {
          'date': 1
        }
      }, {
        '$group': {
          '_id': '$_id', 
          'gainedSubscribers': {
            '$push': {
              'date': '$date', 
              'total': '$total'
            }
          }
        }
      }
    ], 
    'lostSubscribers': [
      {
        '$match': {
          '_id': mongoose.Types.ObjectId(userId)
        }
      }, {
        '$project': {
          'subscribeHistory': 1
        }
      }, {
        '$unwind': {
          'path': '$subscribeHistory'
        }
      }, {
        '$match': {
          'subscribeHistory.status': 'unsubscribed'
        }
      }, {
        '$group': {
          '_id': {
            '_id': '$_id', 
            'date': '$subscribeHistory.date'
          }, 
          'total': {
            '$sum': 1
          }
        }
      }, {
        '$project': {
          '_id': '$_id._id', 
          'date': '$_id.date', 
          'total': '$total'
        }
      }, {
        '$sort': {
          'date': 1
        }
      }, {
        '$group': {
          '_id': '$_id', 
          'lostSubscribers': {
            '$push': {
              'date': '$date', 
              'total': '$total'
            }
          }
        }
      }
    ]
  }
  }
  ]

  const result =  ( await UserModal.aggregate(pipeline))[0];

  return result;
  
}

exports.holdUserAccount = async(id) => {

  return await UserModal.findByIdAndUpdate({ _id: id}, { status: 'hold' }, {new: true})

}

exports.activateUserAccount = async(id) => {

  return await UserModal.findByIdAndUpdate({ _id: id}, { status: 'active' }, {new: true})

}

/************************************************************* */
// User Feed
//Get user Feed
/*exports.getFeedData = async () => {
  const aggregatePipeLine = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'subscribeTo',
        foreignField: '_id',
        as: 'celebratoryData',
      },
    },
    {
      $project: {
        celebratoryData: 1,
      },
    },
    {
      $project: {
        'celebratoryData._id': 1,
        'celebratoryData.content': 1,
        'celebratoryData.firstName': 1,
        'celebratoryData.lastName': 1,
        'celebratoryData.email': 1,
        'celebratoryData.phoneNumber': 1,
        'celebratoryData.isCelebratory': 1,
      },
    },
    {
      $unwind: {
        path: '$celebratoryData',
      },
    },
    {
      $unwind: {
        path: '$celebratoryData.content',
      },
    },
    {
      $lookup: {
        from: 'contents',
        localField: 'celebratoryData.content',
        foreignField: '_id',
        as: 'content',
      },
    },
    {
      $unwind: {
        path: '$content',
      },
    },
    {
      $project: {
        'celebratoryData.content': 0,
      },
    },
    {
      $match: {
        'content.access': { $ne: 'private' },
      },
    },
    { $sort: { 'content.createdAt': -1 } },
  ];
  const feedResult = await UserModal.aggregate(aggregatePipeLine).exec();
  return feedResult;
};*/

//remove contentId from user
/*exports.removeContentIdToUser = async (id, contentId) => {
  const user = await UserModal.findById(id).exec();
  let contentArray = [...user.content];
  contentArray = contentArray.filter((item) => {
    return !_.isEqual(item, contentId);
  });
  return await UserModal.findByIdAndUpdate(
    id,
    {
      $set: {
        content: contentArray,
      },
    },
    {
      new: true,
    }
  );
};*/

/****************************************************************** */