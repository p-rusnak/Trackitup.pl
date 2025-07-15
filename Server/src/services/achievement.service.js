const prisma = require('../db');
const { songBadges, metaBadges } = require('../consts/badges');
const { clearTitles } = require('../consts/titleRequirements');

const songs = require('./songs.json');

const gradeOrder = ['SSS', 'SS', 'S', 'Ap', 'A', 'Bp', 'B', 'Cp', 'C', 'Dp', 'D', 'F'];
const gradeBetterOrEqual = (a, b) => {
  if (!a) return false;
  return gradeOrder.indexOf(a) <= gradeOrder.indexOf(b);
};

const diffNumber = (diff) => parseInt(diff.replace(/[^0-9]/g, ''), 10);

const buildTitleMap = () => {
  const map = {};
  Object.entries(songs).forEach(([id, s]) => {
    map[s.title] = id;
  });
  return map;
};

const titleToId = buildTitleMap();

const checkBadges = (scores, currentBadges) => {
  const badges = new Set(currentBadges || []);

  Object.entries(songBadges).forEach(([category, reqs]) => {
    let completed = 0;
    reqs.forEach((req) => {
      if (req.level === 'Expert') return;
      const songId = titleToId[req.song];
      if (!songId) return;
      const sc = scores.find((s) => s.song_id === songId && s.diff === req.chart);
      if (sc && gradeBetterOrEqual(sc.grade, req.grade || 'SS')) {
        badges.add(`${category}_${req.level}`);
        completed += 1;
      }
    });
    if (completed >= 10 && category === 'twistExpert') {
      badges.add(metaBadges.twistExpert);
    }
  });

  const hasAllLevels = ['drill', 'gimmick', 'half', 'run', 'twistExpert'].every((c) => {
    return badges.has(`${c}_10`);
  });
  if (hasAllLevels) badges.add(metaBadges.specialist);

  return Array.from(badges);
};

const checkTitles = (scores, currentTitles) => {
  const titles = new Set(currentTitles || []);

  clearTitles.forEach((req) => {
    const [minStr, maxStr] = req.diffs.split('-');
    const min = parseInt(minStr, 10);
    const max = maxStr ? parseInt(maxStr, 10) : min;
    const songSet = new Set();
    scores.forEach((sc) => {
      const n = diffNumber(sc.diff);
      if (n >= min && n <= max && sc.grade) {
        songSet.add(sc.song_id);
      }
    });
    if (songSet.size >= req.count && (!req.requires || titles.has(req.requires))) {
      titles.add(req.title);
    }
  });

  return Array.from(titles);
};

const updateUserAchievements = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { scores: true } });
  if (!user) return;

  const badges = checkBadges(user.scores, user.badges);
  const titles = checkTitles(user.scores, user.titles);

  await prisma.user.update({ where: { id: userId }, data: { badges, titles } });
};

module.exports = { updateUserAchievements };
