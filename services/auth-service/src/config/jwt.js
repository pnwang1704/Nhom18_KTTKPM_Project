const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./env');

const JWT_EXPIRES_IN = '1d';

function signToken(payload) {
  const tokenPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  };

  return jwt.sign(tokenPayload, jwtSecret, {
    expiresIn: JWT_EXPIRES_IN
  });
}

function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = {
  signToken,
  verifyToken,
  JWT_EXPIRES_IN
};