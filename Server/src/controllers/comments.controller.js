const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { commentsService } = require('../services');

const getComments = catchAsync(async (req, res) => {
    const filter = pick(req.params, ['parentId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await commentsService.queryComments(filter, options);
    res.send(result);
});

const postComment = catchAsync(async (req, res) => {
    const comment = await commentsService.createComment(req.params.parentId, req.body, req.user);
    res.status(httpStatus.CREATED).send(comment);
});


module.exports = {
    getComments,
    postComment,
};
