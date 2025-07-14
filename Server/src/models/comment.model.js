const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const authorScheam = mongoose.Schema(
    {
        id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
    }
)

const commentSchema = mongoose.Schema(
    {
        parentId: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: authorScheam,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;