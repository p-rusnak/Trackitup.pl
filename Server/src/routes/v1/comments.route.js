const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const commentsController = require('../../controllers/comments.controller');
const commentsValidation = require('../../validations/comments.validation');

const router = express.Router();

// router
//     .route('/');


router
    .route('/:parentId')
    .get(auth(), validate(commentsValidation.getComments), commentsController.getComments)
    .post(auth('postComments'), validate(commentsValidation.postComment), commentsController.postComment)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

/**
 * @swagger
 * /comments/{id}:
 *   post:
 *     summary: Create a comment
 *     description: Only users can create comments.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *             example:
 *               content: This is an example comment
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