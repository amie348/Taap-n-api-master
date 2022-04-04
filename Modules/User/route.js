const { uploadPicture } = require('../../uploadContent/multer');
const {auth} = require(`../../middleware/auth`);
const {
  signup,
  login,
  getAllUsers,
  getUserById,
  deleteUser,

  // reset Password
  sendCodeToEmail,
  validateEmailCodeToDB,
  resetpassword,

  getUserWallet,
  updateUserWallet,

  updateUserProfile,
  updateUserProfilePicture,

  usersForInterest,
  userInterests,
  handleUserInterest,

  userFavorites,
  handelUserFavorites,

  userReviews,
  userAllContent,

  //tickets
  buyEventTicket,
  myCreatedTickets,
  purchasedEventTicket,

  //service
  getUserServices,
  createUserService,
  updateUserService,
  deleteUserService,

  // getting statistics for dashboard
  getDashticks,

  handleSubscribeUser,
} = require('./controller');

async function routes(fastify) {
  fastify.post('/signup', signup);
  fastify.post('/login', login);
  fastify.get('/', getAllUsers);
  fastify.get('/:id', getUserById);
  fastify.delete('/:id', deleteUser);

  // reset Password Process
  fastify.put('/forget-password', sendCodeToEmail);
  fastify.put('/forget-password/check-code', validateEmailCodeToDB);
  fastify.put('/reset-password/', resetpassword);

  fastify.put('/:id', updateUserProfile);
  fastify.put(
    '/update-profile/:id',
    { preHandler: uploadPicture },
    updateUserProfilePicture
  );

  fastify.get('/wallet/:id', getUserWallet);
  fastify.post('/wallet/:id', updateUserWallet);

  fastify.get('/interested-users/:interestId', usersForInterest);
  fastify.get('/interest/:id', userInterests);
  fastify.put('/interest/:id', handleUserInterest);

  fastify.get('/favorite/:id', userFavorites);
  fastify.put('/favorite/:id', handelUserFavorites);

  fastify.get('/review/:id', userReviews);

  fastify.get('/content/:id', userAllContent);

  //tickets related
  fastify.post('/ticket/buy-ticket', buyEventTicket);
  fastify.get('/ticket/buy-ticket/:id', purchasedEventTicket);
  fastify.get('/ticket/user-tickets/:id', myCreatedTickets);

  //fastify.put('/subscribe', handleSubscribeUser);
  fastify.get('/services/:id', getUserServices);
  fastify.post('/services/:id', createUserService);
  fastify.put('/services/:id', updateUserService);
  fastify.delete('/services/:id', deleteUserService);
  //fastify.get('/ticket/user-tickets/:id', myCreatedTickets);
  //fastify.get('/ticket/user-tickets/:id', myCreatedTickets);

  // statistics for dashboard
  fastify.get('/dashtics', {preHandler: auth}, getDashticks);

}

module.exports = routes;
