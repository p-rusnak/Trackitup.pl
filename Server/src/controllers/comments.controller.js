const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { commentsService } = require('../services');

const postComment = catchAsync(async (req, res) => {
  const mode = req.params.mode;
  const comment = await commentsService.createComment(req.body, mode, req.user);
  res.status(httpStatus.CREATED).send(comment);
});

const getComments = catchAsync(async (req, res) => {
  const { mode, songId, diff } = req.params;
  const comments = await commentsService.getComments(mode, songId, diff);
  res.send(comments);
});

module.exports = { postComment, getComments };
