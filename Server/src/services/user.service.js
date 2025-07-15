const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const prisma = require('../db');

const createUser = async (userBody) => {
  const emailTaken = await prisma.user.findFirst({ where: { email: userBody.email } });
  if (emailTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const usernameTaken = await prisma.user.findFirst({ where: { username: userBody.username } });
  if (usernameTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }
  const hashedPassword = await bcrypt.hash(userBody.password, 8);
  const user = await prisma.user.create({ data: { ...userBody, password: hashedPassword, role: 'user', badges: [], titles: [] } });
  return user;
};

const queryUsers = async () => {
  const results = await prisma.user.findMany();
  return { results };
};

const getUserById = async (id) => prisma.user.findUnique({ where: { id } });
const getUserByEmail = async (email) => prisma.user.findUnique({ where: { email } });
const getUserByUsername = async (username) => prisma.user.findUnique({ where: { username } });

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email) {
    const existing = await prisma.user.findFirst({ where: { email: updateBody.email, NOT: { id: userId } } });
    if (existing) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  }
  if (updateBody.password) {
    updateBody.password = await bcrypt.hash(updateBody.password, 8);
  }
  return prisma.user.update({ where: { id: userId }, data: updateBody });
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return prisma.user.delete({ where: { id: userId } });
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUserById,
  deleteUserById,
};
