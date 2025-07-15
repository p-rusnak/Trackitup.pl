const prisma = require('../db');

const createRating = async (data, user) => {
  const { song_id, diff, rating } = data;
  const existing = await prisma.rating.findFirst({ where: { userId: user.id, song_id, diff } });
  if (existing) {
    return prisma.rating.update({ where: { id: existing.id }, data: { value: rating } });
  }
  return prisma.rating.create({ data: { userId: user.id, song_id, diff, value: rating } });
};

const getRatingStats = async (song_id, diff) => {
  const ratings = await prisma.rating.findMany({ where: { song_id, diff } });
  const result = { harder: 0, ok: 0, easier: 0 };
  ratings.forEach((r) => {
    if (r.value > 0) result.harder += 1;
    else if (r.value < 0) result.easier += 1;
    else result.ok += 1;
  });
  return result;
};

module.exports = { createRating, getRatingStats };
