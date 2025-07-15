const Joi = require('joi');

const createRating = {
  body: Joi.object().keys({
    song_id: Joi.string().required(),
    diff: Joi.string().required(),
    rating: Joi.number().integer().valid(-1, 0, 1).required(),
  }),
};

module.exports = { createRating };
