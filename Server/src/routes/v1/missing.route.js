const express = require('express');
const validate = require('../../middlewares/validate');
const missingValidation = require('../../validations/missing.validation');
const missingController = require('../../controllers/missing.controller');

const router = express.Router();

router.route('/')
  .post(validate(missingValidation.createMissing), missingController.createMissing);

module.exports = router;
