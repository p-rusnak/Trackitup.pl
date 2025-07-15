const prisma = require('../db');
const achievementService = require('./achievement.service');

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
    const res = await prisma.score.update({ where: { id: existing.id }, data: { grade } });
    await achievementService.updateUserAchievements(user.id, res);
    return res;
  }
  const res = await prisma.score.create({ data: { song_id, diff, grade, userId: user.id, mode } });
  await achievementService.updateUserAchievements(user.id, res);
  return res;
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
