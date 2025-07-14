const Joi = require('joi');

const getComments = {
    params: Joi.object().keys({
        parentId: Joi.string(),
    })
}

const postComment = {
    params: Joi.object().keys({
        parentId: Joi.string(),
    }),
    body: Joi.object()
        .keys({
            content: Joi.string(),
        })
        .min(1),
};


module.exports = {
    getComments,
    postComment,
};
