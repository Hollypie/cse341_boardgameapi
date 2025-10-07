const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/games');
const { createGameRules, updateGameRules, gameIdParamRules } = require('../middleware/games.js');
const { validate } = require('../middleware/validator.js');
const { requireAuth } = require('../middleware/authenticate.js');

/**
 * GET all games
 * @swagger
 * /games/:
 *   get:
 *     tags: [Games]
 *     description: Get all games.
 *     responses:
 *       200:
 *         description: Array of games returned successfully
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Game'
 *       500:
 *         description: Internal server error
 */
router.get('/', gamesController.getAllGames);

/**
 * GET a single game by ID
 * @swagger
 * /games/{id}:
 *   get:
 *     tags: [Games]
 *     description: Get a single game by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Game ID
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Game found
 *         schema:
 *           $ref: '#/definitions/Game'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Game not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', gameIdParamRules(), validate, gamesController.getSingleGame);

/**
 * POST create a new game
 * @swagger
 * /games/:
 *   post:
 *     tags: [Games]
 *     description: Create a new game.
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Game information
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Game'
 *     responses:
 *       201:
 *         description: Game created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  requireAuth,
  (req, res, next) => {
    console.log('--- Incoming POST /games body ---');
    console.log(req.body);

    console.log('--- Field types ---');
    Object.keys(req.body).forEach(key => {
      console.log(`${key}: ${typeof req.body[key]} -> ${req.body[key]}`);
    });

    next(); // continue to validation
  },
  createGameRules(),
  validate,
  gamesController.createGame
);

/**
 * PUT update a game by ID
 * @swagger
 * /games/{id}:
 *   put:
 *     tags: [Newgame]
 *     description: Update an existing game.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Game ID
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         description: Updated game information
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Game'
 *     responses:
 *       200:
 *         description: Game updated successfully
 *       400:
 *         description: Invalid ID or missing fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put('/:id', requireAuth, gameIdParamRules(), updateGameRules(), validate, gamesController.updateGame);

/**
 * DELETE a game by ID
 * @swagger
 * /games/{id}:
 *   delete:
 *     tags: [Games]
 *     description: Delete a game by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Game ID
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Game deleted successfully
 *       400:
 *         description: Invalid ID format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', requireAuth, gameIdParamRules(), validate, gamesController.deleteGame);

module.exports = router;