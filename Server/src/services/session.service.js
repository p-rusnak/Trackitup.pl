const prisma = require('../db');

const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour
const START_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

const handleScore = async (userId, scoreId) => {
  const now = new Date();
  let session = await prisma.session.findFirst({
    where: { userId, endedAt: null },
  });
  if (session) {
    if (now - session.lastScore.getTime() > SESSION_TIMEOUT_MS) {
      await prisma.session.update({
        where: { id: session.id },
        data: { endedAt: session.lastScore },
      });
      session = null;
    }
  }
  if (session) {
    await prisma.score.update({ where: { id: scoreId }, data: { sessionId: session.id } });
    await prisma.session.update({ where: { id: session.id }, data: { lastScore: now } });
    return session;
  }

  const threshold = new Date(now.getTime() - START_THRESHOLD_MS);
  const recent = await prisma.score.findMany({
    where: { userId, sessionId: null, createdAt: { gte: threshold } },
    orderBy: { createdAt: 'asc' },
    take: 2,
  });
  if (recent.length >= 2) {
    session = await prisma.session.create({
      data: { userId, startedAt: recent[0].createdAt, lastScore: now },
    });
    const ids = recent.map((s) => s.id).concat(scoreId);
    await prisma.score.updateMany({ where: { id: { in: ids } }, data: { sessionId: session.id } });
    return session;
  }
  return null;
};

const getCurrent = async (userId) =>
  prisma.session.findFirst({ where: { userId, endedAt: null }, include: { scores: true } });

const endSession = async (userId) => {
  const session = await prisma.session.findFirst({ where: { userId, endedAt: null } });
  if (!session) return null;
  return prisma.session.update({ where: { id: session.id }, data: { endedAt: new Date() } });
};

const cancelSession = async (userId) => {
  const session = await prisma.session.findFirst({ where: { userId, endedAt: null } });
  if (!session) return null;
  const id = session.id;
  await prisma.score.updateMany({ where: { sessionId: id }, data: { sessionId: null } });
  await prisma.session.delete({ where: { id } });
  return null;
};

const deleteSession = async (id, userId) => {
  const session = await prisma.session.findUnique({ where: { id: Number(id) } });
  if (!session || session.userId !== userId) return null;
  await prisma.score.updateMany({ where: { sessionId: session.id }, data: { sessionId: null } });
  await prisma.session.delete({ where: { id: session.id } });
  return session;
};

const listSessions = async (userId) =>
  prisma.session.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
    include: { _count: { select: { scores: true } } },
  });

const listOngoingSessions = async (limit = 10) =>
  prisma.session.findMany({
    where: { endedAt: null },
    orderBy: { id: 'desc' },
    take: limit,
    include: {
      user: { select: { username: true, avatarUrl: true } },
      _count: { select: { scores: true } },
    },
  });

const listAllSessions = async (limit = 10) =>
  prisma.session.findMany({
    take: limit,
    orderBy: { id: 'desc' },
    include: {
      user: { select: { username: true, avatarUrl: true } },
      _count: { select: { scores: true } },
    },
  });

const getSession = async (id) =>
  prisma.session.findUnique({ where: { id: Number(id) }, include: { scores: true } });

module.exports = {
  handleScore,
  getCurrent,
  endSession,
  cancelSession,
  listSessions,
  listOngoingSessions,
  listAllSessions,
  getSession,
  deleteSession,
};
