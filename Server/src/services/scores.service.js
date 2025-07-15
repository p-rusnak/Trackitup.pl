const prisma = require('../db');

const getScores = async (filter) => {
  const scores = await prisma.score.findMany({ where: { userId: filter.userId, mode: filter.mode } });
  const response = {};
  scores.forEach((el) => {
    if (response[el.diff]) {
      if (response[el.diff][el.song_id]) {
        response[el.diff][el.song_id].grade = el.grade;
      } else {
        response[el.diff][el.song_id] = { grade: el.grade };
      }
    } else {
      response[el.diff] = { [el.song_id]: { grade: el.grade } };
    }
  });
  return response;
};

const createScore = async (scoreBody, mode, user) => {
  const { song_id, diff, grade } = scoreBody;
  const existing = await prisma.score.findFirst({
    where: { userId: user.id, song_id, diff, mode },
  });

  if (grade === null || grade === undefined || grade === '') {
    if (existing) {
      await prisma.score.delete({ where: { id: existing.id } });
    }
    return null;
  }

  if (existing) {
    return prisma.score.update({ where: { id: existing.id }, data: { grade } });
  }
  return prisma.score.create({ data: { song_id, diff, grade, userId: user.id, mode } });
};

const getLatestScores = async (limit = 10) =>
  prisma.score.findMany({
    take: limit,
    orderBy: { id: 'desc' },
    include: {
      user: {
        select: { username: true },
      },
    },
  });

module.exports = {
  getScores,
  createScore,
  getLatestScores,
};
