const Joi = require('joi');

const postRival = {
  body: Joi.object().keys({
    rivalId: Joi.string().required(),
  }),
};

const getRivalScores = {
  params: Joi.object().keys({
    mode: Joi.string(),
    songId: Joi.string().required(),
    diff: Joi.string().required(),
  }),
  query: Joi.object().keys({
    userId: Joi.string(),
  }),
};

module.exports = { postRival, getRivalScores };
