const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const gamesController = require('../../controllers/games.controller');
const gamesValidation = require('../../validations/games.validation');

const router = express.Router();

router
    .route('/')
    .post(auth('addGame'), validate(gamesValidation.postGame), gamesController.postGame)
router.get('/', validate(gamesValidation.getGames), gamesController.getGames)

router.get('/:gameId', validate(gamesValidation.getGame), gamesController.getGame)
router.get('/:gameId', validate(gamesValidation.getGame), gamesController.getGame)

router
    .route('/:gameId/rate')
    .get(auth('getOwnRating'), validate(gamesValidation.getOwnRating), gamesController.getOwnRating)
    .post(auth('rateGame'), validate(gamesValidation.rateGame), gamesController.rateGame)

router.get('/:gameId/rate/:userId', validate(gamesValidation.getRating), gamesController.getRating)
    

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game info
 */
/**
 * @swagger
 * /game:
 *   get:
 *     summary: Get all games
 *     description: Everyone can get gamelist
 *     tags: [Games]
 *     requestBody:
 *       required: false
 *     responses:
 *       "201":
 *         description: Found
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *
*/
/**
 * @swagger
 * /game:
 *   post:
 *     summary: Add a game
 *     description: Only moderators can add a game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - coverImg
 *               - developer
 *               - publisher
 *               - platform
 *               - description
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *                 description: game name
 *               coverImg:
 *                 type: string
 *                 description: Image url
 *               developer:
 *                 type: array
 *                 description: array of developers
 *               publisher:
 *                 type: array
 *                 description: array of publishers
 *               platform:
 *                 type: array
 *                 description: array of platforms
 *               description:
 *                 type: description
 *                 description: description
 *             example:
 *               id: "20"
 *               name: Bloodborne
 *               coverImg: image.pdf
 *               developer: [From Software]
 *               publisher: [SIE]
 *               platform: [ps4]
 *               description: Description
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *
*/
/**
 * @swagger
 * /game/{id}:
 *   get:
 *     summary: Get a game
 *     description: Everyone can view a game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Game Id
 *     requestBody:
 *       required: false
 *     responses:
 *       "201":
 *         description: Found
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *
*/
/**
 * @swagger
 * /game/{gameId}/rate:
 *   get:
 *     summary: Get a game
 *     description: Everyone can view a game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: Game Id
 *     requestBody:
 *       required: false
 *     responses:
 *       "201":
 *         description: Found
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     summary: Rate a game
 *     description: Users can add a game
 *     tags: [Games, Rate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: Game Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: user selected score
 *               description:
 *                 type: string
 *                 description: description
 *               ownStatus:
 *                 type: number
 *                 description: ownStatus
 *               playedStatus:
 *                 type: number
 *                 description: playedStatus
 *             example:
 *               rating: 5
 *               description: Description
 *               ownStatus: 1
 *               playedStatus: 2
 *     responses:
 *       "201":
 *         description: Created
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *
*/
/**
 * @swagger
 * /game/{gameId}/rate/{userId}:
 *   get:
 *     summary: Get a game
 *     description: Everyone can view a game
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: Game Id
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User Id
 *     requestBody:
 *       required: false
 *     responses:
 *       "201":
 *         description: Found
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *
*/