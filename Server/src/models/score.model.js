const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const scoreSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        mode: {
            type: String,
            required: true,
        },
        songId: {
            type: String,
            required: true,
        },
        diff: {
            type: String,
            required: true,
        },
        grade: {
            type: String,
            required: false,
        },
    },
);
// add plugin that converts mongoose to json
scoreSchema.plugin(toJSON);
scoreSchema.plugin(paginate);

const Rating = mongoose.model('Score', scoreSchema);

module.exports = Rating;