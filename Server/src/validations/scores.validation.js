const Joi = require('joi');

const createScore = {
  query: Joi.object().keys({
    mode: Joi.string(),
  }),
  body: Joi.object().keys({
    grade: Joi.string().allow('', null),
    song_id: Joi.string().required(),
    diff: Joi.string().required(),
  }),
};

const getScores = {
  query: Joi.object().keys({
    mode: Joi.string(),
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

module.exports = {
  createScore,
  getScores,
  getLatestScores,
  getLatestPlayers,
};
