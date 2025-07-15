const Joi = require('joi');

const postGoal = {
  body: Joi.object().keys({
    song_id: Joi.string().required(),
    diff: Joi.string().required(),
  }),
};

module.exports = { postGoal };
