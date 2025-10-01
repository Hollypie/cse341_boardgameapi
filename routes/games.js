const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/games');
const { createGameRules, updateGameRules, gameIdParamRules } = require('../middlewear/games.js');
const { validate } = require('../middlewear/validator.js');
const { isAuthenticated } = require('../middlewear/authenticate.js');

/**
 * @route GET /games
 * @summary Get all games
 * @group Games
 * @returns {object[]} 200 - An array of games
 */
router.get('/', gamesController.getAllGames);

/**
 * @route GET /games/{id}
 * @summary Get a single game by ID
 * @group Games
 * @param {string} id.path.required - Game ID
 * @returns {object} 200 - A single game
 * @returns {Error} 404 - Game not found
 */
router.get('/:id', gameIdParamRules(), validate, gamesController.getSingleGame);

/**
 * @route POST /games
 * @summary Create a new game
 * @group Games
 * @param {object} request.body.required - Game info
 * @param {string} request.body.title.required
 * @param {string} request.body.publisher.required
 * @param {number} request.body.yearPublished.required
 * @param {number} request.body.minPlayers.required
 * @param {number} request.body.maxPlayers.required
 * @param {number} request.body.playTime.required
 * @param {string} request.body.complexity.required
 * @param {string} request.body.genre.required
 * @param {string} request.body.description.required
 * @returns {object} 201 - The created game
 * @returns {Error} 400 - Missing required fields
 */
router.post('/', isAuthenticated, createGameRules(), validate, gamesController.createGame);

/**
 * @route PUT /games/{id}
 * @summary Update a game by ID
 * @group Games
 * @param {string} id.path.required - Game ID
 * @param {object} request.body.required - Game info to update
 * @param {string} request.body.title.required
 * @param {string} request.body.publisher.required
 * @param {number} request.body.yearPublished.required
 * @param {number} request.body.minPlayers.required
 * @param {number} request.body.maxPlayers.required
 * @param {number} request.body.playTime.required
 * @param {string} request.body.complexity.required
 * @param {string} request.body.genre.required
 * @param {string} request.body.description.required
 * @returns {object} 200 - Updated game
 * @returns {Error} 400 - Invalid ID or missing fields
 * @returns {Error} 404 - Game not found
 */
router.put('/:id', isAuthenticated, gameIdParamRules(), updateGameRules(), validate, gamesController.updateGame);

/**
 * @route DELETE /games/{id}
 * @summary Delete a game by ID
 * @group Games
 * @param {string} id.path.required - Game ID
 * @returns {string} 200 - Success message
 * @returns {Error} 400 - Invalid ID
 * @returns {Error} 404 - Game not found
 */
router.delete('/:id', isAuthenticated, gameIdParamRules(), validate, gamesController.deleteGame);

module.exports = router;
