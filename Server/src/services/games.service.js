const { Game, Rating } = require('../models');

const getGame = async (gameId) => {
  return Game.findById(gameId);
};

const getGames = async (filter, options) => {
  return Game.paginateGames(filter, options);
};

const getCollection = async (filter) => {
  return Rating.findByUser(filter.userId);
};

const createGame = async (gameBody) => {
  return Game.createGame({ ...gameBody });
};

const getRating = async (gameId, userId) => {
  return Rating.findOne(gameId, userId);
};

const createRating = async (gameId, ratingBody, user) => {
  return Rating.upsertRating(gameId, user.id, ratingBody);
};

module.exports = {
  getGame,
  getGames,
  getCollection,
  createGame,
  getRating,
  createRating,
};
