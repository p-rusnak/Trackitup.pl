const express = require('express');
const auth = require('../../middlewares/auth');
const sessionsController = require('../../controllers/sessions.controller');

const router = express.Router();

router.get('/current', auth('getScores'), sessionsController.getCurrent);
router.post('/end', auth('postScores'), sessionsController.endSession);
router.post('/cancel', auth('postScores'), sessionsController.cancelSession);
router.get('/', auth('getScores'), sessionsController.listSessions);

module.exports = router;
