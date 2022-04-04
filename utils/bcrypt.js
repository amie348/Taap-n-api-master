const bcrypt = require('bcrypt');

exports.hashed = async (password) => {
  return await bcrypt.hash(password, 12);
};
