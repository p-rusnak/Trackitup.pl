const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Game = require('./game.model');

const ratingSchema = mongoose.Schema(
    {
        gameId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Game,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        ownStatus: {
            type: Number,
            required: false,
        },
        playedStatus: {
            type: Number,
            required: false,
        }
    },
).index({ gameId: 1, userId: 1 }, { unique: true });
// add plugin that converts mongoose to json
ratingSchema.plugin(toJSON);
ratingSchema.plugin(paginate);

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;