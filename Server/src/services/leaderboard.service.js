const prisma = require('../db');

const parseLevel = (diff) => {
  const n = parseInt(diff.replace('lv_', ''));
  return Number.isNaN(n) ? 0 : n;
};

const getLeaderboard = async (mode) => {
  const users = await prisma.user.findMany({ include: { scores: true } });
  const board = users.map((u) => {
    const scores = u.scores.filter((s) => s.mode === mode && s.grade !== 'F');
    let highest = 0;
    scores.forEach((s) => {
      const level = parseLevel(s.diff);
      if (level > highest) highest = level;
    });
    return { id: u.id, username: u.username, highest };
  });
  board.sort((a, b) => b.highest - a.highest);
  return board;
};

module.exports = { getLeaderboard };
