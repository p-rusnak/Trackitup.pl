const { Comment } = require('../models');

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryComments = async (filter, options) => {
    const comment = await Comment.paginate(filter, options);
    return comment;
};

/**
 * Create a Comment
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
 */
const createComment = async (parentId, commentBody, user) => {
    return Comment.create({
        parentId, 
        content: commentBody.content, 
        author: {
            id: user._id,
            username: user.name,
        }});
};

module.exports = {
    queryComments,
    createComment,
};
