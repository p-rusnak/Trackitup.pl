const prisma = require('../db');

const parseLevel = (diff) => {
  const n = parseInt(diff.replace('lv_', ''));
  return Number.isNaN(n) ? 0 : n;
};

const getLeaderboard = async (mode) => {
  const users = await prisma.user.findMany({ include: { scores: true } });
  const board = users.map((u) => {
    const scores = u.scores.filter((s) => s.mode === mode && ['SSS', 'SS', 'S', 'Ap', 'Bp'].includes(s.grade));
    let highest = 0;
    scores.forEach((s) => {
      const level = parseLevel(s.diff);
      if (level > highest) highest = level;
    });
    return { id: u.id, username: u.username, avatarUrl: u.avatarUrl, highest };
  });
  board.sort((a, b) => b.highest - a.highest);
  return board;
};

const getFullLeaderboard = async () => {
  const users = await prisma.user.findMany({ include: { scores: true } });
  const board = users.map((u) => {
    const singles = u.scores.filter((s) => s.mode === 'item_single' && ['SSS', 'SS', 'S', 'Ap', 'Bp'].includes(s.grade));
    const doubles = u.scores.filter((s) => s.mode === 'item_double' && ['SSS', 'SS', 'S', 'Ap', 'Bp'].includes(s.grade));
    let singlesHighest = 0;
    singles.forEach((s) => {
      const level = parseLevel(s.diff);
      if (level > singlesHighest) singlesHighest = level;
    });
    let doublesHighest = 0;
    doubles.forEach((s) => {
      const level = parseLevel(s.diff);
      if (level > doublesHighest) doublesHighest = level;
    });
    return { id: u.id, username: u.username, avatarUrl: u.avatarUrl, singles: singlesHighest, doubles: doublesHighest };
  });
  return board;
};

module.exports = { getLeaderboard, getFullLeaderboard };
