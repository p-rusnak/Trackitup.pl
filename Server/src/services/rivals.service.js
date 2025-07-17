const prisma = require('../db');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { getGradeIndex } = require('./scores.service');

const MAX_RIVALS = 5;

const toggleRival = async (rivalId, user) => {
  if (rivalId === user.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot add yourself as rival');
  }
  const existing = await prisma.rival.findFirst({ where: { userId: user.id, rivalId } });
  if (existing) {
    await prisma.rival.delete({ where: { id: existing.id } });
    return { removed: true };
  }
  const count = await prisma.rival.count({ where: { userId: user.id } });
  if (count >= MAX_RIVALS) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Maximum number of rivals reached');
  }
  const rival = await prisma.rival.create({ data: { userId: user.id, rivalId } });
  return { rival };
};

const listRivals = async (userId) => {
  const rivals = await prisma.rival.findMany({
    where: { userId },
    include: {
      rival: { select: { id: true, username: true, avatarUrl: true } },
    },
  });
  return rivals.map((r) => r.rival);
};

const getRivalScores = async (userId, mode, songId, diff) => {
  const rivalEntries = await prisma.rival.findMany({ where: { userId } });
  const rivalIds = rivalEntries.map((r) => r.rivalId);
  if (!rivalIds.length) return [];
  const scores = await prisma.score.findMany({
    where: { userId: { in: rivalIds }, song_id: songId, diff, mode },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, username: true, avatarUrl: true } } },
  });
  const result = {};
  scores.forEach((s) => {
    const existing = result[s.userId];
    if (!existing || getGradeIndex(s.grade) < getGradeIndex(existing.grade)) {
      result[s.userId] = { id: s.id, grade: s.grade, user: s.user };
    }
  });
  return Object.values(result);
};

module.exports = { toggleRival, listRivals, getRivalScores };
