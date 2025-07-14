const Joi = require('joi');

const createScore = {
  query: Joi.object().keys({
    mode: Joi.string(),
  }),
  body: Joi.object().keys({
    grade: Joi.string(),
    songId: Joi.string().required(),
    diff: Joi.string().required(),
  }),
};

const getScores = {
  query: Joi.object().keys({
    mode: Joi.string(),
  }),
};

module.exports = {
  createScore,
  getScores,
};
