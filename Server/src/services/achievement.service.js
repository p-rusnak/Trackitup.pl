const prisma = require('../db');
const { songBadges, metaBadges } = require('../consts/badges');
const { clearTitles } = require('../consts/titleRequirements');

const songs = require('./songs.json');

// Grade order from best to worst used when comparing achievements
// SSS > SS > S > Ap > Bp > Cp > Dp > A > B > C > D > F
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
const gradeBetterOrEqual = (a, b) => {
  if (!a) return false;
  return gradeOrder.indexOf(a) <= gradeOrder.indexOf(b);
};

// Grades that qualify when counting clears for title achievements
const titleGrades = ['SSS', 'SS', 'S', 'Ap', 'Bp'];

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
    if (completed >= 10 && metaBadges[category]) {
      badges.add(metaBadges[category]);
    }
  });

  const hasAllLevels = Object.keys(songBadges).every((c) => {
    return badges.has(`${c}_10`);
  });
  if (hasAllLevels) badges.add(metaBadges.specialist);

  return Array.from(badges);
};

const updateBadgesWithScore = (score, currentBadges) => {
  const badges = new Set(currentBadges || []);

  Object.entries(songBadges).forEach(([category, reqs]) => {
    reqs.forEach((req) => {
      if (req.level === 'Expert') return;

      if (
        score.song_id === req.songId.toString() &&
        score.diff === req.diff &&
        score.mode === req.mode &&
        gradeBetterOrEqual(score.grade, req.grade || 'SS')
      ) {
        console.log(`Adding badge for ${category}_${req.level}`);
        badges.add(`${category}_${req.level}`);
      }
    });

    if ([...Array(10).keys()].every((i) => badges.has(`${category}_${i + 1}`)) && metaBadges[category]) {
      badges.add(metaBadges[category]);
    }
  });

  const hasAllLevels = Object.keys(songBadges).every((c) => {
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
      if (n >= min && n <= max && titleGrades.includes(sc.grade)) {
        songSet.add(sc.song_id);
      }
    });
    if (songSet.size >= req.count && (!req.requires || titles.has(req.requires))) {
      titles.add(req.title);
    }
  });

  return Array.from(titles);
};

const updateUserAchievements = async (userId, score = null) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { scores: true } });
  if (!user) return { newBadges: [], newTitles: [] };

  let badges;
  let titles;

  if (score) {
    badges = updateBadgesWithScore(score, user.badges);
    const allScores = user.scores.concat([score]);
    titles = checkTitles(allScores, user.titles);
  } else {
    badges = checkBadges(user.scores, user.badges);
    titles = checkTitles(user.scores, user.titles);
  }

  const newBadges = badges.filter((b) => !user.badges.includes(b));
  const newTitles = titles.filter((t) => !user.titles.includes(t));

  await prisma.user.update({ where: { id: userId }, data: { badges, titles } });

  return { newBadges, newTitles };
};

module.exports = { updateUserAchievements };
