const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const commentsValidation = require('../../validations/comments.validation');
const commentsController = require('../../controllers/comments.controller');

const router = express.Router();

router
  .route('/:mode/:songId/:diff')
  .get(commentsController.getComments)
  .post(
    auth('postScores'),
    validate(commentsValidation.postComment),
    commentsController.postComment,
  );

module.exports = router;
