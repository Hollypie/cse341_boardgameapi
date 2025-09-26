const { body, validationResult, param } = require('express-validator')

const userValidationRules = () => {
  return [
    body('username').isString(),
    body('email').isEmail()
  ]
}

const reviewValidationRules = () => {
  return [
    body('userId').isString(),
    body('gameId').isString(),
    body('rating').isNumeric(),
    body('comment').isString(),
    body('createdAt').isString()
  ]
}

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

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
    createGameRules,
    updateGameRules,
    gameIdParamRules
}