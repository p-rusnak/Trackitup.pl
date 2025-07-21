const Joi = require('joi');

const postComment = {
  body: Joi.object().keys({
    song_id: Joi.string().required(),
    diff: Joi.string().required(),
    text: Joi.string().min(1).required(),
  }),
};

module.exports = { postComment };
