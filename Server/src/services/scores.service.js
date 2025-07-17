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
    const { newBadges, newTitles } = await achievementService.updateUserAchievements(user.id);
    return { score: null, newBadges, newTitles };
  }

  if (existing) {
    const res = await prisma.score.update({ where: { id: existing.id }, data: { grade } });
    const { newBadges, newTitles } = await achievementService.updateUserAchievements(user.id, res);
    return { score: res, newBadges, newTitles };
  }
  const res = await prisma.score.create({ data: { song_id, diff, grade, userId: user.id, mode } });
  const { newBadges, newTitles } = await achievementService.updateUserAchievements(user.id, res);
  return { score: res, newBadges, newTitles };
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

const getLatestPlayers = async (limit = 10) =>
  prisma.score.findMany({
    distinct: ['userId'],
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: { username: true },
      },
    },
  });

const getAllScores = async (page = 1, limit = 30) => {
  const skip = (page - 1) * limit;
  const results = await prisma.score.findMany({
    skip,
    take: limit,
    orderBy: { id: 'desc' },
    include: {
      user: {
        select: { username: true },
      },
    },
  });
  const totalResults = await prisma.score.count();
  const totalPages = Math.ceil(totalResults / limit);
  return { results, page, limit, totalPages, totalResults };
};


module.exports = {
  getScores,
  createScore,
  getLatestScores,
  getLatestPlayers,
  getAllScores,
};
