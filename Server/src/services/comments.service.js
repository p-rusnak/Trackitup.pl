const { Comment } = require('../models');

const queryComments = async (filter) => {
  return Comment.paginateComments(filter);
};

const createComment = async (parentId, commentBody, user) => {
  return Comment.create({
    parentId,
    content: commentBody.content,
    author: { id: user.id, username: user.name },
  });
};

module.exports = {
  queryComments,
  createComment,
};
