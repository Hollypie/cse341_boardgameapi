const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/games');
const { createGameRules, updateGameRules, gameIdParamRules } = require('../middlewear/games.js');
const { validate } = require('../middlewear/validator.js');

// GET all games
// #swagger.tags = ['Games']
// #swagger.description = 'Get all games.'
router.get('/', gamesController.getAllGames);

// GET single game by ID
// #swagger.tags = ['Games']
// #swagger.description = 'Get a single game by its ID.'
// #swagger.parameters['id'] = { description: 'Game ID', required: true, type: 'string' }
router.get('/:id', gameIdParamRules(), validate, gamesController.getSingleGame);

// POST create a new game
// #swagger.tags = ['Games']
// #swagger.description = 'Create a new game.'
// #swagger.parameters['body'] = {
//     in: 'body',
//     description: 'Game information',
//     required: true,
//     schema: { $ref: "#/definitions/Game" }
// }
// #swagger.responses[201] = {
//     description: 'Game created successfully',
//     schema: { $ref: "#/definitions/Game" }
// }
router.post('/', createGameRules(), validate, gamesController.createGame);

// PUT update a game
// #swagger.tags = ['Games']
// #swagger.description = 'Update an existing game.'
// #swagger.parameters['id'] = { description: 'Game ID', required: true, type: 'string' }
// #swagger.parameters['body'] = {
//     in: 'body',
//     description: 'Updated game info',
//     required: true,
//     schema: { $ref: "#/definitions/Game" }
// }
router.put('/:id', gameIdParamRules(), updateGameRules(), validate, gamesController.updateGame);

// DELETE a game
// #swagger.tags = ['Games']
// #swagger.description = 'Delete a game by ID.'
// #swagger.parameters['id'] = { description: 'Game ID', required: true, type: 'string' }
router.delete('/:id', gameIdParamRules(), validate, gamesController.deleteGame);

module.exports = router;
