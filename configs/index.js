/* eslint-disable import/no-dynamic-require */
const env = process.env.NODE_ENV || 'production';

module.exports = require(`./${env}`);
