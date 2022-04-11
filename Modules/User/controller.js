const bcrypt = require('bcrypt');
const env = require('../../configs');
const validate = require('./validate');
const {
  createToken
} = require('../../utils/jwt');
//const { validateUserSchema } = require('./model');
const {
  randomNumber
} = require('../../utils/index');
const {
  updateTrend
} = require('../Trending/service');
const {
  NodeMailer
} = require('../../utils/nodemailer');
const {
  uploadFile
} = require('../../uploadContent/s3');
const {
  checkIfValidObjectId
} = require('../../db/validData');

const {
  createRequestDataForNewUser,
  addUserIdToRequest,
  getUserServices,
  postUserService,
  changeUserService,
  removeUserServices,
} = require('../Requests/service');

const {
  ticketById,
  buyTicketByUser,
  getUserPurchasedTickets,
  getUserCreatedTickets,
} = require('../Tickets/service');

const {
  createWallet,
  addUserIdToWallet,
  insertDataToWallet,
  getUserWallet,
  validateTransactionSchema,
} = require('../Wallet/service');

const {
  checkUserByEmail,
  checkUserById,
  //checkIfValidObjectId,
  addUser,
  allUsers,
  getUser,
  removeUser,

  updateEmailCode,
  updatePassword,

  userProfilePicture,
  updateUserProfile,

  allUsersForInterest,
  userInterests,
  handleUserInterests,

  userAllFavorites,
  handleUserFavorites,

  userAllReviews,

  userContent,

  getStatistics,
  holdUserAccount,
  activateUserAccount,
  getPaginatedUsers,

  addUserFavorite,
  removeUserFavorite,
} = require('./service');

/***************************************************** */
// create new user
exports.signup = async (request, reply) => {
  const {
    error
  } = validate.validateUserSchema(request.body);
  if (error) {
    return reply.status(400).send({
      message: error.details[0].message
    });
  }

  try {
    const userExist = await checkUserByEmail(request.body.email);
    if (userExist) {
      return reply
        .status(400)
        .send({
          message: 'user already exist with that email'
        });
    }

    const walletData = await createWallet();
    const requestData = await createRequestDataForNewUser();
    const resetCode = randomNumber();

    //await updateEmailCode(user._id, resetCode);

    const {
      _id,
      firstName,
      lastName,
      email,
      //address,
      //phoneNumber,
      //isVerified,
      //isCelebratory,
      //createAt,
      //wallet,
    } = await addUser(request.body, walletData._id, requestData._id, resetCode);

    NodeMailer(email, resetCode);
    await addUserIdToWallet(walletData._id, _id);
    await addUserIdToRequest(requestData._id, _id);

    /*const user = {
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      isVerified,
      isCelebratory,
      wallet,
      createAt,
    };*/

    return reply.status(201).send({
      //payload: user,
      message: `user  '${firstName} ${lastName}' signUp successfully`,
    });
  } catch (error) {
    return reply.status(500).send({
      message: error.message
    });
  }
};

// Login
exports.login = async (request, reply) => {
  const {
    email,
    password
  } = request.body;
  try {
    const user = await checkUserByEmail(email);
    if (!user)
      return reply
        .status(404)
        .send({
          payload: null,
          message: 'email does not exist',
          token: null
        });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return reply
        .status(404)
        .send({
          payload: null,
          message: 'password incorrect',
          token: null
        });

    const result = await getUser(user._id);
    const token = createToken(result);
    return reply
      .status(200)
      .send({
        payload: result,
        message: 'signIn successfully ',
        token
      });
  } catch (error) {
    return reply.status(500).send({
      message: error.message
    });
  }
};

// get all users
exports.getAllUsers = async (request, reply) => {
  const result = await allUsers();
  const message = result.length ? 'All users Data' : 'still there is no user';
  return reply
    .status(200)
    .send({
      payload: result.length ? result : null,
      length: result.length,
      message: message
    });
};

// get user by id
exports.getUserById = async (request, reply) => {
  const {
    id
  } = request.params;
  try {
    const validId = await checkIfValidObjectId(id);
    if (!validId) {
      return reply
        .status(404)
        .send({
          payload: null,
          message: `not valid data to get user`
        });
    }
    const user = await getUser(id);
    if (!user) {
      return reply
        .status(404)
        .send({
          payload: null,
          message: `no user on that data`
        });
    }
    await updateTrend(id);
    return reply.status(200).send({
      payload: user,
      message: 'user Data'
    });
  } catch (error) {
    return reply.status(404).send({
      payload: null,
      message: error.message
    });
  }
};

// delete user by ID
exports.deleteUser = async (request, reply) => {
  const {
    id
  } = request.params;
  const validId = await checkIfValidObjectId(id);
  if (!validId) {
    return reply
      .status(200)
      .send({
        message: `not valid data to get user`
      });
  }
  
  const user = await getUser(id);
  if (!user) {
    return reply
      .status(200)
      .send({
        message: `no user on that data`
      });
  }
  await removeUser(id);
  return reply.send({
    message: `${user.firstName}'s account deleted successfully`,
  });
};

//get user wallet data
exports.getUserWallet = async (request, reply) => {
  const {
    id
  } = request.params;
  try {
    if (!(await checkIfValidObjectId(id))) {
      return reply.status(404).send({
        message: `not valid data to get user`
      });
    }

    const result = await getUserWallet(id);
    return reply.status(201).send({
      message: 'Wallet Detail',
      payload: result,
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message
    });
  }
};

// make transaction to user wallet
exports.updateUserWallet = async (request, reply) => {
  const {
    id
  } = request.params;
  const {
    error
  } = validateTransactionSchema(request.body);
  if (error) {
    return reply.status(200).send({
      message: error.details[0].message
    });
  }

  try {
    if (!(await checkIfValidObjectId(id))) {
      return reply.status(404).send({
        message: `not valid data to get user`
      });
    }

    const result = await insertDataToWallet(id, request.body);
    return reply.status(201).send({
      message: result.message,
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message
    });
  }
};

// send code to email to reset Password
exports.sendCodeToEmail = async (request, reply) => {
  const {
    email
  } = request.body;

  try {
    const user = await checkUserByEmail(email);
    if (!user) {
      return reply.status(200).send({
        message: 'email does not exist'
      });
    }
    const emailVerificationCode = randomNumber();
    await updateEmailCode(user._id, emailVerificationCode);

    NodeMailer(email, emailVerificationCode);
    return reply
      .status(200)
      .send({
        message: `email has been send to ${email}`
      });
  } catch (error) {
    return reply
      .status(200)
      .send({
        message: `there is an error your process`
      });
  }
};

//validate email  by code to reset Password
exports.validateEmailCodeToDB = async (request, reply) => {
  const {
    email,
    code
  } = request.body;

  try {
    const user = await checkUserByEmail(email);
    if (!user) {
      return reply.status(200).send({
        message: 'email does not exist'
      });
    }
    if (user.resetCode == code) {
      const result = await updateUserProfile(user._id, {
        isVerified: true
      });
      console.log(result);
      return reply
        .status(200)
        .send({
          payload: true,
          message: `Your Code match`
        });
    }
    return reply
      .status(200)
      .send({
        payload: false,
        message: `Your Code does't match`
      });
  } catch (error) {
    return reply
      .status(200)
      .send({
        message: `there is an error your process`
      });
  }
};

// reset Password
exports.resetpassword = async (request, reply) => {
  const {
    email,
    password
  } = request.body;

  try {
    const user = await checkUserByEmail(email);
    console.log(user)
    if (!user) {
      return reply.status(200).send({
        message: 'email does not exist'
      });
    }
    const data = await updatePassword(user._id, password);
    console.log(data)
    return reply.status(200).send({
      message: `password is updated`
    });
  } catch (error) {
    return reply
      .status(200)
      .send({
        message: `there is an error your process`
      });
  }
};

// update user by ID
exports.updateUserProfilePicture = async (request, reply) => {
  const {
    id
  } = request.params;
  try {
    if (!(await checkIfValidObjectId(id))) {
      return reply.status(200).send({
        message: `not valid  object Id`
      });
    }
    const userExist = await checkUserById(id);
    if (!userExist) {
      return reply.status(200).send({
        message: `not valid data to get user`
      });
    }
    if (!request.file.filename) {
      return reply.status(200).send({
        message: 'there is no file in the request ',
      });
    }
    const fileData = {
      filePath: `public/${request.file.filename}`,
    };
    const uploadedFile = await uploadFile(fileData);
    await userProfilePicture(id, uploadedFile.Location);
    return reply.status(200).send({
      message: 'picture Updated',
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message,
    });
  }
};

// update user by ID
exports.updateUserProfile = async (request, reply) => {
  const {
    id
  } = request.params;
  try {
    if (!(await checkIfValidObjectId(id))) {
      return reply
        .status(200)
        .send({
          payload: null,
          message: `not valid data to get user`
        });
    }
    const userExist = await checkUserById(id);
    if (!userExist) {
      return reply
        .status(200)
        .send({
          payload: null,
          message: `not valid data to get user`
        });
    }

    const result = await updateUserProfile(id, request.body);
    return reply.status(200).send({
      message: 'User Updated',
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message,
    });
  }
};
/***************************************************** */

/***************************************************** */

//all users for that interest
exports.usersForInterest = async (request, reply) => {
  const {
    interestId
  } = request.params;
  const validId = await checkIfValidObjectId(interestId);
  if (!validId) {
    return reply
      .status(404)
      .send({
        payload: null,
        message: `not valid data to get user`
      });
  }
  try {
    const result = await allUsersForInterest(interestId);
    return reply.status(200).send({
      payload: result,
      message: 'all users for that interest',
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message,
    });
  }
};

//user interest list
exports.userInterests = async (request, reply) => {
  const validId = await checkIfValidObjectId(request.params.id);
  if (!validId) {
    return reply
      .status(404)
      .send({
        payload: null,
        message: `not valid data to get user`
      });
  }
  const user = await getUser(request.params.id);
  if (!user) {
    return reply
      .status(404)
      .send({
        payload: null,
        message: `no user on that data`
      });
  }
  try {
    const result = await userInterests(request.params.id);
    return reply.status(200).send({
      payload: result,
      message: 'list of user Interests',
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message,
    });
  }
};

// handle User Interest
exports.handleUserInterest = async (request, reply) => {
  const {
    id
  } = request.params;
  const {
    interestId
  } = request.body;
  const validId = await checkIfValidObjectId(id);
  if (!validId) {
    return reply
      .status(200)
      .send({
        payload: null,
        message: `not valid data to get user`
      });
  }
  const user = await getUser(id);
  if (!user) {
    return reply
      .status(200)
      .send({
        payload: null,
        message: `no user on that data`
      });
  }
  const result = await handleUserInterests(id, interestId);
  return reply.status(200).send({
    payload: result.interest,
    message: result.message,
  });
};
/***************************************************** */

/***************************************************** */
// user favorites
exports.userFavorites = async (request, reply) => {
  try {
    const result = await userAllFavorites(request.params.id);
    return reply.status(200).send({
      payload: result,
      message: 'list of favorite users',
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message,
    });
  }
};

// handle User favorite
exports.handelUserFavorites = async (request, reply) => {


  try {
    const validId = await checkIfValidObjectId(request.params.id);
    if (!validId) {
      return reply.status(200).send({
        message: `not valid Id to get user`
      });
    }

    const userExist = await checkUserById(request.params.id);
    if (!userExist) {
      return reply.status(200).send({
        message: `Invalid User Id`
      });
    }
    const validUserToFavorite = await checkUserById(request.body.favoriteUser);
    if (!validUserToFavorite) {
      return reply.status(200).send({
        message: `Invalid User to like`
      });
    }
    const result = await handleUserFavorites(
      request.params.id,
      request.body.favoriteUser
    );
    return reply.send({
      payload: result.user,
      message: result.message,
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message,
    });
  }

};
/***************************************************** */

/***************************************************** */
// user reviews
exports.userReviews = async (request, reply) => {
  try {
    const result = await userAllReviews(request.params.id);
    return reply.status(200).send({
      payload: result,
      message: 'user Reviews',
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message,
    });
  }
};
/***************************************************** */

/***************************************************** */
// user All Content
exports.userAllContent = async (request, reply) => {
  try {
    const result = await userContent(request.params.id);
    return reply.status(200).send({
      payload: result,
      message: 'User All Content',
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message,
    });
  }
};

/***************************************************** */

/***************************************************** */

// handle User favorite
/*exports.handleSubscribeUser = async (request, reply) => {
  const { subscribeBy, subscribeTo } = request.query;
  console.log(subscribeBy, subscribeTo);
  /*const result = await handleUserFavorites(
    request.params.id,
    request.body.favoriteUser
  );*/
/*return reply.send({
    payload: null, //result.user,
    message: null, //result.message,
  });
};*/
/***************************************************** */

/***************************************************** */

//Tickets
// buy ticket by user
exports.buyEventTicket = async (request, reply) => {
  const {
    userId,
    ticketId,
    amount
  } = request.body;
  try {
    const {
      error
    } = validate.buyTicketSchema(request.body);
    if (error) {
      return reply.status(200).send({
        message: error.details[0].message
      });
    }

    const userExist = await checkUserById(userId);
    if (!userExist) {
      return reply.status(200).send({
        message: `Invalid UserId`
      });
    }

    const ticketExist = await ticketById(ticketId);
    if (!ticketExist) {
      return reply.status(200).send({
        message: `Invalid ticketId`
      });
    }

    if (ticketExist.price !== amount) {
      return reply.status(200).send({
        message: `you have to pay ${ticketExist.price} for this ticket can\'n proceed`,
      });
    }

    const ticketData = {
      amount: amount,
      user: {
        _id: userExist._id,
        userPicture: userExist.profilePicture,
        userName: `${userExist.firstName} ${userExist.lastName}`,
      },
    };
    const result = await buyTicketByUser(ticketId, ticketData);
    return reply.status(200).send({
      message: `you have buy ${result.name} ticket with ${result.price}`,
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message
    });
  }
};

//  user purchased tickets
exports.purchasedEventTicket = async (request, reply) => {
  const {
    id
  } = request.params;
  try {
    const validId = await checkIfValidObjectId(id);
    if (!validId) {
      return reply.status(200).send({
        message: `not valid Id to get user`
      });
    }

    const userExist = await checkUserById(id);
    if (!userExist) {
      return reply.status(200).send({
        message: `Invalid UserId`
      });
    }

    const result = await getUserPurchasedTickets(id);
    return reply.status(200).send({
      payload: result,
      message: `${userExist.firstName} ${userExist.lastName} Purchased Tickets`,
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message
    });
  }
};

//  user Created Tickets by userId
exports.myCreatedTickets = async (request, reply) => {
  const {
    id
  } = request.params;
  try {
    const validId = await checkIfValidObjectId(id);
    if (!validId) {
      return reply.status(200).send({
        message: `not valid Id to get user`
      });
    }

    const userExist = await checkUserById(id);
    if (!userExist) {
      return reply.status(200).send({
        message: `Invalid UserId`
      });
    }

    const result = await getUserCreatedTickets(id);
    return reply.status(200).send({
      payload: result,
      message: `Tickets of ${userExist.firstName} ${userExist.lastName}`,
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message
    });
  }
};

/***************************************************** */

/***************************************************** */

//User services
//  get user services by userId
exports.getUserServices = async (request, reply) => {
  const {
    id
  } = request.params;
  try {
    const validId = await checkIfValidObjectId(id);
    if (!validId) {
      return reply.status(200).send({
        message: `not valid Id to get user`
      });
    }

    const userExist = await checkUserById(id);
    if (!userExist) {
      return reply.status(200).send({
        message: `Invalid UserId`
      });
    }

    const result = await getUserServices(id);
    return reply.status(200).send({
      payload: result,
      message: `${userExist.firstName} ${userExist.lastName} Services`,
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message
    });
  }
};

//  create new services by userId
exports.createUserService = async (request, reply) => {
  const {
    id
  } = request.params;
  try {
    const validateObject = {
      id,
      ...request.body
    };
    const {
      error
    } = validate.createServiceSchema(validateObject);
    if (error) {
      return reply.status(200).send({
        message: error.details[0].message
      });
    }

    const validId = await checkIfValidObjectId(id);
    if (!validId) {
      return reply
        .status(200)
        .send({
          message: `not valid user Id to get user`
        });
    }

    const userExist = await checkUserById(id);
    if (!userExist) {
      return reply.status(200).send({
        message: `Invalid User`
      });
    }

    /*const serviceObject = await getUserServices(id);
    if (!serviceObject) {
      return reply
        .status(200)
        .send({ message: `There is no data on that user for service` });
    }*/
    //console.log('serviceObject', serviceObject);

    /*if (request.body.price < 0) {
      return reply
        .status(200)
        .send({ message: `Price for the service can't be -ve` });
    }*/

    await postUserService(id, request.body);
    return reply.status(200).send({
      message: `New Services '${request.body.name}' added successfully`,
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message
    });
  }
};

//  update user services by userId
exports.updateUserService = async (request, reply) => {
  const {
    id
  } = request.params;
  try {
    const {
      error
    } = validate.updateServiceSchema(request.body);
    if (error) {
      return reply.status(200).send({
        message: error.details[0].message
      });
    }

    const validId = await checkIfValidObjectId(id);
    if (!validId) {
      return reply.status(200).send({
        message: `not valid Id to get user`
      });
    }

    const userExist = await checkUserById(id);
    if (!userExist) {
      return reply.status(200).send({
        message: `Invalid UserId`
      });
    }

    await changeUserService(id, request.body);
    return reply.status(200).send({
      message: `Service updated`
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message
    });
  }
};

//  delete user services by userId
exports.deleteUserService = async (request, reply) => {
  const {
    id
  } = request.params;
  try {
    const validateObject = {
      id,
      ...request.body
    };
    const {
      error
    } = validate.deleteServiceSchema(validateObject);
    if (error) {
      return reply.status(200).send({
        message: error.details[0].message
      });
    }

    const validId = await checkIfValidObjectId(id);
    if (!validId) {
      return reply.status(200).send({
        message: `not valid Id to get user`
      });
    }

    const userExist = await checkUserById(id);
    if (!userExist) {
      return reply.status(200).send({
        message: `Invalid UserId`
      });
    }

    await removeUserServices(id, request.body.serviceId);
    return reply.status(200).send({
      message: ` Services Removed `,
    });
  } catch (error) {
    return reply.status(200).send({
      message: error.message
    });
  }
};


/***************************************************** */ 
exports.getDashticks = async(request, reply) => {

  const { user } = request;

  console.log(user)

  try{

    console.log("-----------------------")
    const statistics = await getStatistics(user.id);

    return reply.status(200).send({

      payload: statistics,
      message: 'Request completed successfully'
      
    })

  } 
  catch(error){

    console.log(`error`, error)

  }




}

exports.holdAccount = async(request, reply) => {

  const { id } = request.params;

  try{

    const result = await holdUserAccount(id);

    if(!result){

      console.log('User Do Not Exist')

      reply.status(404).send({

        message: 'User do not exist'

      })

    }

    reply.status(200).send({

      message: 'Request Successfully completed',
      payload: result
      
    })


  } catch(error){

    console.log('error', error)

    reply.status(500).send({

      message: 'Internal servr error occured',
      error: error.message

      
    })

  }

}

exports.activateAccount = async(request, reply) => {

  const { id } = request.params;

  try{

    const result = await activateUserAccount(id);

    if(!result){

      console.log('User Do Not Exist')

      reply.status(404).send({

        message: 'User do not exist'

      })

    }

    reply.status(200).send({

      message: 'Request Successfully completed',
      payload: result
      
    })


  } catch(error){

    console.log('error', error)

    reply.status(500).send({

      message: 'Internal servr error occured',
      error: error.message

      
    })

  }

}

exports.paginatedUsers = async(request, reply) => {

  try{

    let filters = {}

    let { offset, page, search } = request.query;

    console.log('search------------>', typeof search)


    if(search){

      filters[`firstName`] = new RegExp(search.trim(), `i`);
    
    }

    const [ startRecord, noOfRecords ] = [ parseInt(page) <= 1 ? 0 : parseInt((parseInt(page) - 1) * parseInt(offset)), parseInt(offset) <= 0 ? 1 : parseInt(offset)];

    let {possibleDataDrawings, users} = await getPaginatedUsers(startRecord, noOfRecords, filters)

    return reply.status(200).send({

      message: 'RequestCompleted Successfully',
      payload: {possibleDataDrawings, users},
      hassError: false

    })


  } 
  catch(error){

    console.log('error', error)

    reply.status(500).send({

      message: 'internal server error occured',
      hasError: true

    })


  }

}



