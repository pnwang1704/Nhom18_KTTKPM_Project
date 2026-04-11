const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const ROLES = require('../config/roles');

const SALT_ROUNDS = 10;

function createServiceError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

async function register(email, password) {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw createServiceError('Email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const createdUser = await userRepository.createUser({
    email,
    passwordHash,
    role: ROLES.USER
  });

  return sanitizeUser(createdUser);
}

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw createServiceError('Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw createServiceError('Invalid credentials', 401);
  }

  return sanitizeUser(user);
}

module.exports = {
  register,
  login
};