const prisma = require('../db');

const toggleGoal = async (data, mode, user) => {
  const { song_id, diff } = data;
  const existing = await prisma.goal.findFirst({
    where: { userId: user.id, song_id, diff, mode },
  });
  if (existing) {
    await prisma.goal.delete({ where: { id: existing.id } });
    return { removed: true };
  }
  const goal = await prisma.goal.create({
    data: { userId: user.id, song_id, diff, mode },
  });
  return { goal };
};

const getGoals = async (mode, userId) =>
  prisma.goal.findMany({ where: { userId, mode } });

module.exports = { toggleGoal, getGoals };
