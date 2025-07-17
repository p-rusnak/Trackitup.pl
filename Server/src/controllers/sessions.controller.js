const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { sessionService } = require('../services');

const getCurrent = catchAsync(async (req, res) => {
  const session = await sessionService.getCurrent(req.user.id);
  if (!session) {
    return res.status(httpStatus.NO_CONTENT).send();
  }
  res.send(session);
});

const endSession = catchAsync(async (req, res) => {
  await sessionService.endSession(req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const cancelSession = catchAsync(async (req, res) => {
  await sessionService.cancelSession(req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const listSessions = catchAsync(async (req, res) => {
  const userId = req.query.userId || req.user.id;
  const sessions = await sessionService.listSessions(userId);
  res.send(sessions);
});

const getSession = catchAsync(async (req, res) => {
  const session = await sessionService.getSession(req.params.id);
  if (!session) {
    return res.status(httpStatus.NOT_FOUND).send();
  }
  res.send(session);
});

module.exports = { getCurrent, endSession, cancelSession, listSessions, getSession };
