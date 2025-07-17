const Joi = require('joi');

const listSessions = {
  query: Joi.object().keys({
    userId: Joi.string(),
  }),
};

module.exports = { listSessions };
