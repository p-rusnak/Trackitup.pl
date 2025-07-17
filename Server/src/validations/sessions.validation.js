const Joi = require('joi');

const listSessions = {
  query: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const getSession = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

const deleteSession = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

module.exports = { listSessions, getSession, deleteSession };
