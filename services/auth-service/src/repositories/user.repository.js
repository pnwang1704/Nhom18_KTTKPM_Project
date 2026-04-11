const prisma = require('../config/db');

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email }
  });
}

async function findById(id) {
  return prisma.user.findUnique({
    where: { id }
  });
}

async function createUser({ email, passwordHash, role = 'user' }) {
  return prisma.user.create({
    data: {
      email,
      passwordHash,
      role
    }
  });
}

module.exports = {
  findByEmail,
  findById,
  createUser
};
