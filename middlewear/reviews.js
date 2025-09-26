const { body, validationResult, param } = require('express-validator')

const createReviewRules = () => {
  return [
    body('userId').isString(),
    body('gameId').isString(),
    body('rating').isNumeric().withMessage('Rating must be a number'),
    body('comment').isString(),
  ]
}

const updateReviewRules = () => {
  return [
    body('userId').optional().isString(),
    body('gameId').optional().isString(),
    body('rating').optional().isNumeric().withMessage('Rating must be a number'),
    body('comment').optional().isString(),
  ]
}

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

const reviewIdParamRules = () => [
    param('id').isMongoId().withMessage('Invalid review ID'),
];

module.exports = {
    createReviewRules,
    updateReviewRules,
    reviewIdParamRules
}