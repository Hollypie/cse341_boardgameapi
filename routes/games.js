const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/games');
const { createGameRules, updateGameRules, gameIdParamRules } = require('../middleware/games.js');
const { validate } = require('../middleware/validator.js');
const { requireAuth } = require('../middleware/authenticate.js');

/**
 * GET all games
 */
// #swagger.tags = ['Games']
// #swagger.description = 'Get all games.'
// #swagger.responses[200] = {
//     description: 'Array of games returned successfully',
//     schema: [{ $ref: "#/definitions/Game" }]
// }
// #swagger.responses[500] = { description: 'Internal server error' }
router.get('/', gamesController.getAllGames);

/**
 * GET a single game by ID
 */
// #swagger.tags = ['Games']
// #swagger.description = 'Get a single game by its ID.'
// #swagger.parameters['id'] = { description: 'Game ID', required: true, type: 'string' }
// #swagger.responses[200] = { description: 'Game found', schema: { $ref: "#/definitions/Game" } }
// #swagger.responses[404] = { description: 'Game not found' }
// #swagger.responses[400] = { description: 'Invalid ID format' }
// #swagger.responses[500] = { description: 'Internal server error' }
router.get('/:id', gameIdParamRules(), validate, gamesController.getSingleGame);

// #swagger.tags = ['Games']
// #swagger.description = 'Create a new game.'
// #swagger.parameters['body'] = {
//     in: 'body',
//     description: 'Game information',
//     required: true,
//     schema: { 
//         $ref: "#/definitions/Game" 
//     },
//     example: {
//         title: "Test Game",
//         publisher: "Test Publisher",
//         yearPublished: 2025,
//         minPlayers: 1,
//         maxPlayers: 4,
//         playTime: 30,
//         complexity: "Medium",
//         genre: "Strategy",
//         description: "A sample game for testing."
//     }
// }
router.post(
  '/',
//   requireAuth,
  (req, res, next) => {
    console.log('--- Incoming POST /games body ---');
    console.log(req.body);
    
    console.log('--- Field types ---');
    Object.keys(req.body).forEach(key => {
      console.log(`${key}: ${typeof req.body[key]} -> ${req.body[key]}`);
    });

    next(); // continue to validation AFTER logging all fields
  },
  createGameRules(),
  validate,
  gamesController.createGame
); 

/**
 * PUT update a game by ID
 */
// #swagger.tags = ['Games']
// #swagger.description = 'Update an existing game.'
// #swagger.parameters['id'] = { description: 'Game ID', required: true, type: 'string' }
// #swagger.parameters['body'] = {
//     in: 'body',
//     description: 'Updated game information',
//     required: true,
//     schema: { $ref: "#/definitions/Game" }
// }
// #swagger.responses[200] = { description: 'Game updated successfully', schema: { $ref: "#/definitions/Game" } }
// #swagger.responses[400] = { description: 'Invalid ID or missing fields' }
// #swagger.responses[404] = { description: 'Game not found' }
// #swagger.responses[500] = { description: 'Internal server error' }
router.put('/:id', requireAuth, gameIdParamRules(), updateGameRules(), validate, gamesController.updateGame);

/**
 * DELETE a game by ID
 */
// #swagger.tags = ['Games']
// #swagger.description = 'Delete a game by its ID.'
// #swagger.parameters['id'] = { description: 'Game ID', required: true, type: 'string' }
// #swagger.responses[200] = { description: 'Game deleted successfully' }
// #swagger.responses[404] = { description: 'Game not found' }
// #swagger.responses[400] = { description: 'Invalid ID format' }
// #swagger.responses[500] = { description: 'Internal server error' }
router.delete('/:id', requireAuth, gameIdParamRules(), validate, gamesController.deleteGame);

module.exports = router;
