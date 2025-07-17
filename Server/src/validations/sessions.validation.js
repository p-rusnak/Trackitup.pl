const Joi = require('joi');

const listSessions = {
  query: Joi.object().keys({
    userId: Joi.string(),
  }),
};

const listOngoingSessions = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
  }),
};

const listAllSessions = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
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

module.exports = {
  listSessions,
  listOngoingSessions,
  listAllSessions,
  getSession,
  deleteSession,
};
