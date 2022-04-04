/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const env = require('../configs');

exports.createToken = (user) =>
  jwt.sign({ email: user.email, id: user._id }, env.JWT_SECRET_KEY, {
    expiresIn: '10h',
  });
exports.verifyToken = (token) => jwt.verify(token, env.JWT_SECRET_KEY);
exports.decodeToken = (token) => jwt.decode(token);
