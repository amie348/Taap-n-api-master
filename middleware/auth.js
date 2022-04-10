const { verifyToken, decodeToken } = require("../utils/jwt");

const UserModal = require(`../Modules/User/model`);
const Role = require(`../Modules/Role/model`);
const RoleModal = require("../Modules/Role/model");

const auth = async (request, reply, next) => {
  try {

    const token = request.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    if(!token){

      console.log(`Unauthorized User`)
      return reply.status(403).send({

        message: 'Unauthorized User'

      })

    }

    let data = verifyToken(token);
    console.log('data', data)

    const User = await UserModal.findOne({ _id : data.id, status: {$ne: 'hold'}},{_id: 1})

    if(!User){

      return reply.status(401).send({

        message: 'Unauthorized User'

      })

    }

    request.user = data;
    next()
    
  } catch (error) {
    console.log(error);
    
    return reply.status(500).send({

      message: error.message

    })

  }
};

const isAdmin  = async(request, reply, next) => {

  try{

    if(request.user.role != 'admin'){

      console.log('Forbidden Request')

      return reply.status(403).send({


          message: 'Access denaied'
      })

    }

    next()


  } catch(error){

    console.log('error', error)

    return reply.status(500).send({

      message: 'Interna server error occured while authorizaing',
      error: error.message
    
    })


  }

}

module.exports = {

  auth,
  isAdmin

}
