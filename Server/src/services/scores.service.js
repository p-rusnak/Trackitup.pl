const { Score } = require('../models');

const getScores = async (filter) => {
  const scores = await Score.findByUser(filter.userId, filter.mode);
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
  return Score.createScore({ ...scoreBody, userId: user.id, mode });
};

module.exports = {
  getScores,
  createScore,
};
