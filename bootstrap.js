const Role = require('./Modules/Role/model');
const globalConstants = require('./utils/constants');
const { postUser } = require('./Modules/User/service');
const UserModal = require('./Modules/User/model');

exports.bootStrap = async () => {
  const role = await Role.findOne({ role: globalConstants.ADMIN_ROLE });
  if (!role) {
    console.log('INSIDE BOOTSTRAP');
    const adminRole = new Role({
      role: globalConstants.ADMIN_ROLE,
      features: globalConstants.ADMIN_FEATURES,
    });

    const savedRole = await adminRole.save();
    const adminUser = new UserModal({
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@gmail.com',
      status: 'ACTIVE',
      password: 'admin',
      isVerified: true,
      roleId: savedRole._id,
    });
    await adminUser.save();
  }
};
