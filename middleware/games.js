const { body, param } = require('express-validator')

const createGameRules = () => {
  return [
    body('title').isString(),
    body('publisher').isString(),
    body('yearPublished').isInt({ min: 1900 }), // example: positive integer check
    body('minPlayers').isInt({ min: 1 }),
    body('maxPlayers').isInt({ min: 1 }),
    body('playTime').isInt({ min: 1 }),
    body('complexity').isString(),
    body('genre').isString(),
    body('description').isString(),
  ]
}

const updateGameRules = () => [
    body('title').optional().isString(),
    body('publisher').optional().isString(),
    body('yearPublished').optional().isInt({ min: 1900 }),
    body('minPlayers').optional().isInt({ min: 1 }),
    body('maxPlayers').optional().isInt({ min: 1 }),
    body('playTime').optional().isInt({ min: 1 }),
    body('complexity').optional().isString(),
    body('genre').optional().isString(),
    body('description').optional().isString(),
];

const gameIdParamRules = () => [
    param('id').isMongoId().withMessage('Invalid game ID'),
];

module.exports = {
    createGameRules,
    updateGameRules,
    gameIdParamRules
}