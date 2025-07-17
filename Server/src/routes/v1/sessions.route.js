const express = require('express');
const auth = require('../../middlewares/auth');
const sessionsController = require('../../controllers/sessions.controller');
const validate = require('../../middlewares/validate');
const sessionsValidation = require('../../validations/sessions.validation');

const router = express.Router();

router.get('/current', auth('getScores'), sessionsController.getCurrent);
router.post('/end', auth('postScores'), sessionsController.endSession);
router.post('/cancel', auth('postScores'), sessionsController.cancelSession);
router.get(
  '/ongoing',
  auth('getScores'),
  validate(sessionsValidation.listOngoingSessions),
  sessionsController.listOngoingSessions,
);
router.get(
  '/all',
  auth('getScores'),
  validate(sessionsValidation.listAllSessions),
  sessionsController.listAllSessions,
);
router.get('/', auth('getScores'), sessionsController.listSessions);
router.get('/:id', auth('getScores'), validate(sessionsValidation.getSession), sessionsController.getSession);
router.delete('/:id', auth('postScores'), validate(sessionsValidation.deleteSession), sessionsController.deleteSession);

module.exports = router;
