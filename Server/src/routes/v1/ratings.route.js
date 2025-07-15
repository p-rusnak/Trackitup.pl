const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const ratingsValidation = require('../../validations/ratings.validation');
const ratingsController = require('../../controllers/ratings.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('postRatings'), validate(ratingsValidation.createRating), ratingsController.createRating);

router.route('/:songId/:diff').get(ratingsController.getRating);

module.exports = router;
