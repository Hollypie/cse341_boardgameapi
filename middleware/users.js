const { body, param } = require('express-validator')
const { validate } = require('./validator.js');

const createUserRules = () => {
    return [
        body('username').isString(),
        body('email').isEmail()
    ];
};


const updateUserRules = () => {
    return [
        body('username').optional().isString(),
        body('email').optional().isEmail()
    ];
};

const userIdParamRules = () => [
    param('id').isMongoId().withMessage('Invalid user ID'),
];

module.exports = {
    createUserRules,
    updateUserRules,
    userIdParamRules
}