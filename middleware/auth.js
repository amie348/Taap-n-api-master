const { verifyToken, decodeToken } = require("../utils/jwt");

const auth = async (request, reply, next) => {
  try {

    console.log('request.headers', request.headers)

    const token = request.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let data;

    if(!token){

      console.log(`Unauthorized User`)
      return reply.status(403).send({

        message: 'Unauthorized User'

      })

    }

    if (token && isCustomAuth) {
      data = verifyToken(token);
      request.userId = data?.id;
    } else {
      data = decodeToken(token);
      request.userId = data?.sub;
    }

    next();
  } catch (error) {
    console.log(error);
    
    return reply.status(500).send({

      message: error.message

    })

  }
};

module.exports = {

  auth

} 
