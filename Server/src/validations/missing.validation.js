const Joi = require('joi');

const createMissing = {
  body: Joi.object().keys({
    song_name: Joi.string().required(),
    diff: Joi.string().required(),
  }),
};

module.exports = { createMissing };
