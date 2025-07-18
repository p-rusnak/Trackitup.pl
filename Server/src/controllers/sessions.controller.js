const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
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

const listOngoingSessions = catchAsync(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const sessions = await sessionService.listOngoingSessions(limit);
  res.send(sessions);
});

const listAllSessions = catchAsync(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const sessions = await sessionService.listAllSessions(limit);
  res.send(sessions);
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

const deleteSession = catchAsync(async (req, res) => {
  const removed = await sessionService.deleteSession(req.params.id, req.user.id);
  if (!removed) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  getCurrent,
  endSession,
  cancelSession,
  listOngoingSessions,
  listAllSessions,
  listSessions,
  getSession,
  deleteSession,
};
