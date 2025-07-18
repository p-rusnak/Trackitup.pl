const Joi = require('joi');

const createScore = {
  query: Joi.object().keys({
    mode: Joi.string(),
  }),
  body: Joi.object().keys({
    grade: Joi.string().allow('', null),
    song_id: Joi.string().required(),
    diff: Joi.string().required(),
    perfects: Joi.number().integer().allow(null),
    greats: Joi.number().integer().allow(null),
    good: Joi.number().integer().allow(null),
    bad: Joi.number().integer().allow(null),
    misses: Joi.number().integer().allow(null),
    combo: Joi.number().integer().allow(null),
    total: Joi.number().integer().allow(null),
  }),
};

const getScores = {
  query: Joi.object().keys({
    mode: Joi.string(),
    userId: Joi.string(),
  }),
};

const getScoreHistory = {
  params: Joi.object().keys({
    mode: Joi.string(),
    songId: Joi.string().required(),
    diff: Joi.string().required(),
  }),
  query: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const getLatestScores = {
  query: Joi.object().keys({
    limit: Joi.number(),
  }),
};

const getLatestPlayers = {
  query: Joi.object().keys({
    limit: Joi.number(),
  }),
};

const getAllScores = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
    player: Joi.string(),
    songId: Joi.string(),
    diff: Joi.string(),
    mode: Joi.string(),
    grade: Joi.string(),
    from: Joi.date(),
    to: Joi.date(),
    sortBy: Joi.string(),
  }),
};

const deleteScore = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const getBestScore = {
  params: Joi.object().keys({
    mode: Joi.string(),
    songId: Joi.string().required(),
    diff: Joi.string().required(),
  }),
};

const getDailyScores = {
  query: Joi.object().keys({
    userId: Joi.string(),
    from: Joi.date(),
    to: Joi.date(),
  }),
};

module.exports = {
  createScore,
  getScores,
  getScoreHistory,
  getBestScore,
  getLatestScores,
  getLatestPlayers,
  getAllScores,
  deleteScore,
  getDailyScores,
};
