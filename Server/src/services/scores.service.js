const { gamesService } = require('.');
const { Score } = require('../models');
const pick = require('../utils/pick');

/**
 * Query for scores
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getScores = async (filter, options) => {
    const scores = await Score.find({userId: filter.userId, mode: filter.mode});
    let response = {};

    scores.forEach(el => {
        if (response[el.diff]) {
            if (response[el.diff][el.songId]) {
                response[el.diff][el.songId].grade = el.grade;
            } else {
                response[el.diff][el.songId] = { grade: el.grade }
                }
        } else {
            response[el.diff] = { [el.songId]: { grade: el.grade } }
        } 
    });
    return response;
};

/**
 * Create a Score
 * @param {Object} scoreBody
 * @returns {Promise<Comment>}
 */
const createScore = async (scoreBody, mode, user) => {
    return Score.create({ ...scoreBody, userId: user.id, mode });
};


module.exports = {
    getScores,
    createScore
};
