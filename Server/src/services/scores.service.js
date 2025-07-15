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
  console.log('Creating score', scoreBody, mode, user);
  return prisma.score.create({ data: { ...scoreBody, userId: user.id, mode } });
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
