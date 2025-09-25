const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

/**
 * @route GET /users
 * @summary Get all users
 * @group Users
 * @returns {object[]} 200 - An array of users
 */
router.get('/', usersController.getAllUsers);

/**
 * @route GET /users/{id}
 * @summary Get a single user by ID
 * @group Users
 * @param {string} id.path.required - User ID
 * @returns {object} 200 - A single user
 * @returns {Error} 404 - user not found
 */
router.get('/:id', usersController.getSingleUser);

/**
 * @route POST /users
 * @summary Create a new user
 * @group Users
 * @param {object} request.body.required - User info
 * @param {string} request.body.username.required
 * @param {string} request.body.email.required
 * @param {string[]} request.body.reviews
 * @returns {object} 201 - The created user
 * @returns {Error} 400 - Missing required fields
 */
router.post('/', usersController.createUser);

/**
 * @route PUT /users/{id}
 * @summary Update a user by ID
 * @group Users
 * @param {string} id.path.required - User ID
 * @param {object} request.body.required - User info to update
 * @param {string} request.body.username.required
 * @param {string} request.body.email.required
 * @param {string[]} request.body.reviews
 * @returns {object} 200 - Updated user
 * @returns {Error} 400 - Invalid ID or missing fields
 * @returns {Error} 404 - User not found
 */
router.put('/:id', usersController.updateUser);

/**
 * @route DELETE /users/{id}
 * @summary Delete a user by ID
 * @group Users
 * @param {string} id.path.required - User ID
 * @returns {string} 200 - Success message
 * @returns {Error} 400 - Invalid ID
 * @returns {Error} 404 - User not found
 */
router.delete('/:id', usersController.deleteUser);

module.exports = router;
