const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getGame = {
    params: Joi.object().keys({
        gameId: Joi.string(),
    })
}

const getGames = {}

const getCollection = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

const postGame = {
    body: Joi.object()
        .keys({
            id: Joi.string(),
            name: Joi.string(),
            coverImg: Joi.string(),
            developer: Joi.array(),
            publisher: Joi.array(),
            platform: Joi.array(),
            description: Joi.string(),
        })
};

const getRating = {
    params: Joi.object().keys({
        gameId: Joi.string(),
        userId: Joi.string(),
    }),
}

const getOwnRating = {
    params: Joi.object().keys({
        gameId: Joi.string(),
    }),
}

const rateGame = {
    params: Joi.object().keys({
        gameId: Joi.string(),
    }),
    body: Joi.object()
        .keys({
            rating: Joi.number(),
            description: Joi.string(),
            ownStatus: Joi.number(),
            playedStatus: Joi.number(),
        })
};



module.exports = {
    getGame,
    getGames,
    getCollection,
    postGame,
    getRating,
    getOwnRating,
    rateGame,
};
