const prisma = require('../db');

const createMissing = async (data) => {
  const { song_name, diff } = data;
  return prisma.missing.create({ data: { song_name, diff } });
};

module.exports = { createMissing };
