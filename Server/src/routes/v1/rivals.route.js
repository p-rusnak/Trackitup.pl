const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const rivalsController = require('../../controllers/rivals.controller');
const rivalsValidation = require('../../validations/rivals.validation');

const router = express.Router();

router
  .route('/')
  .get(auth('getScores'), rivalsController.getRivals)
  .post(auth('postScores'), validate(rivalsValidation.postRival), rivalsController.postRival);

router
  .route('/scores/:mode/:songId/:diff')
  .get(auth('getScores'), validate(rivalsValidation.getRivalScores), rivalsController.getRivalScores);

module.exports = router;
