const { jwtSecret, jwtExpiresIn, refreshTokenExpiresIn } = require('./env');

module.exports = {
  jwtSecret,
  jwtExpiresIn,
  refreshTokenExpiresIn
};