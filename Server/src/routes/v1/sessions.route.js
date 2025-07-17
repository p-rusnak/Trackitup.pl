const express = require('express');
const auth = require('../../middlewares/auth');
const sessionsController = require('../../controllers/sessions.controller');
const validate = require('../../middlewares/validate');
const sessionsValidation = require('../../validations/sessions.validation');

const router = express.Router();

router.get('/current', auth('getScores'), sessionsController.getCurrent);
router.post('/end', auth('postScores'), sessionsController.endSession);
router.post('/cancel', auth('postScores'), sessionsController.cancelSession);
router.get('/', auth('getScores'), sessionsController.listSessions);
router.get('/:id', auth('getScores'), validate(sessionsValidation.getSession), sessionsController.getSession);

module.exports = router;
