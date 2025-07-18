const prisma = require('../db');
const achievementService = require('./achievement.service');
const sessionService = require('./session.service');

const gradeOrder = [
  'SSS',
  'SS',
  'S',
  'Ap',
  'Bp',
  'Cp',
  'Dp',
  'A',
  'B',
  'C',
  'D',
  'F',
  'Failed',
];

const passGrades = ['SSS', 'SS', 'S', 'Ap', 'Bp', 'Cp', 'Dp'];

const getGradeIndex = (g) => {
  const idx = gradeOrder.indexOf(g);
  return idx === -1 ? gradeOrder.length : idx;
};

const getScores = async (filter) => {
  const scores = await prisma.score.findMany({
    where: { userId: filter.userId, mode: filter.mode },
  });
  const response = {};
  scores.forEach((el) => {
    const diffObj = response[el.diff] || {};
    const existing = diffObj[el.song_id]?.grade;
    if (!existing || getGradeIndex(el.grade) < getGradeIndex(existing)) {
      diffObj[el.song_id] = { grade: el.grade };
    }
    response[el.diff] = diffObj;
  });
  return response;
};

const createScore = async (scoreBody, mode, user) => {
  const { song_id, diff, grade, perfects, greats, good, bad, misses, combo, total } = scoreBody;
  let firstPass = false;
  if (grade && passGrades.includes(grade)) {
    const existing = await prisma.score.findFirst({
      where: {
        userId: user.id,
        song_id,
        diff,
        mode,
        grade: { in: passGrades },
      },
    });
    if (!existing) firstPass = true;
  }
  const res = await prisma.score.create({
    data: {
      song_id,
      diff,
      grade: grade || null,
      perfects: perfects ?? null,
      greats: greats ?? null,
      good: good ?? null,
      bad: bad ?? null,
      misses: misses ?? null,
      combo: combo ?? null,
      total: total ?? null,
      userId: user.id,
      mode,
      firstPass,
    },
  });
  const { newBadges, newTitles } = await achievementService.updateUserAchievements(
    user.id,
    res,
  );
  const session = await sessionService.handleScore(user.id, res.id);
  return { score: res, newBadges, newTitles, isNew: firstPass, session };
};

const getLatestScores = async (limit = 10) =>
  prisma.score.findMany({
    take: limit,
    orderBy: { id: 'desc' },
    include: {
      user: {
        select: { username: true, avatarUrl: true },
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
        select: { username: true, avatarUrl: true },
      },
    },
  });

const parseSortBy = (sortBy) => {
  if (!sortBy) {
    return { createdAt: 'desc' };
  }
  const orders = sortBy.split(',').map((sortOpt) => {
    const [field, order = 'asc'] = sortOpt.split(':');
    return { [field]: order === 'desc' ? 'desc' : 'asc' };
  });
  return orders.length === 1 ? orders[0] : orders;
};

const getAllScores = async (page = 1, limit = 30, filters = {}, sortBy) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (filters.player) {
    where.user = { username: { contains: filters.player, mode: 'insensitive' } };
  }
  if (filters.songId) {
    where.song_id = filters.songId;
  }
  if (filters.diff) {
    where.diff = filters.diff;
  }
  if (filters.mode) {
    where.mode = filters.mode;
  }
  if (filters.grade) {
    where.grade = filters.grade;
  }
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) {
      where.createdAt.gte = new Date(filters.from);
    }
    if (filters.to) {
      where.createdAt.lte = new Date(filters.to);
    }
  }

  const orderBy = parseSortBy(sortBy);

  const results = await prisma.score.findMany({
    skip,
    take: limit,
    orderBy,
    where,
    include: {
      user: {
        select: { username: true, avatarUrl: true },
      },
    },
  });
  const totalResults = await prisma.score.count({ where });
  const totalPages = Math.ceil(totalResults / limit);
  return { results, page, limit, totalPages, totalResults };
};

const getScoreHistory = async (userId, mode, songId, diff) =>
  prisma.score.findMany({
    where: { userId, mode, song_id: songId, diff },
    orderBy: { createdAt: 'desc' },
  });

const getBestScore = async (mode, songId, diff) => {
  const scores = await prisma.score.findMany({
    where: { mode, song_id: songId, diff },
    include: { user: { select: { id: true, username: true, avatarUrl: true } } },
  });
  let best = null;
  scores.forEach((s) => {
    if (
      !best ||
      getGradeIndex(s.grade) < getGradeIndex(best.grade) ||
      (getGradeIndex(s.grade) === getGradeIndex(best.grade) && (s.total || 0) > (best.total || 0))
    ) {
      best = s;
    }
  });
  return best;
};

const getDailyScores = async (userId, from, to) => {
  const where = [`"userId" = $1`];
  const params = [userId];
  if (from) {
    params.push(new Date(from));
    where.push(`"createdAt" >= $${params.length}`);
  }
  if (to) {
    params.push(new Date(to));
    where.push(`"createdAt" <= $${params.length}`);
  }
  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const query = `SELECT DATE("createdAt") AS date, COUNT(*)::int AS count FROM "Score" ${whereClause} GROUP BY DATE("createdAt") ORDER BY DATE("createdAt")`;
  return prisma.$queryRawUnsafe(query, ...params);
};

const deleteScore = async (id, userId) => {
  const score = await prisma.score.findUnique({ where: { id } });
  if (!score || score.userId !== userId) return null;
  await prisma.score.delete({ where: { id } });
  await achievementService.updateUserAchievements(userId);
  return score;
};

module.exports = {
  getScores,
  createScore,
  getLatestScores,
  getLatestPlayers,
  getAllScores,
  getScoreHistory,
  deleteScore,
  getGradeIndex,
  getBestScore,
  getDailyScores,
};
