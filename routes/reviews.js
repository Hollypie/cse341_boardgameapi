const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');

/**
 * @route GET /reviews
 * @summary Get all reviews
 * @group Reviews
 * @returns {object[]} 200 - An array of reviews
 */
router.get('/', reviewsController.getAllReviews);

/**
 * @route GET /reviews/{id}
 * @summary Get a single review by ID
 * @group Reviews
 * @param {string} id.path.required - Review ID
 * @returns {object} 200 - A single review
 * @returns {Error} 404 - Review not found
 */
router.get('/:id', reviewsController.getSingleReview);

/**
 * @route POST /reviews
 * @summary Create a new review
 * @group Reviews
 * @param {object} request.body.required - Review info
 * @param {string} request.body.userId.required
 * @param {string} request.body.gameId.required
 * @param {number} request.body.rating.required
 * @param {string} request.body.comment.required
 * @param {string} request.body.createdAt.required
 * @returns {object} 201 - The created review
 * @returns {Error} 400 - Missing required fields
 */
router.post('/', reviewsController.createReview);

/**
 * @route PUT /reviews/{id}
 * @summary Update a review by ID
 * @group Reviews
 * @param {string} id.path.required - Review ID
 * @param {object} request.body.required - Review info to update
 * @param {string} request.body.userId.required
 * @param {string} request.body.gameId.required
 * @param {number} request.body.rating.required
 * @param {string} request.body.comment.required
 * @param {string} request.body.createdAt.required
 * @returns {object} 200 - Updated review
 * @returns {Error} 400 - Invalid ID or missing fields
 * @returns {Error} 404 - Review not found
 */
router.put('/:id', reviewsController.updateReview);

/**
 * @route DELETE /reviews/{id}
 * @summary Delete a review by ID
 * @group Reviews
 * @param {string} id.path.required - Review ID
 * @returns {string} 200 - Success message
 * @returns {Error} 400 - Invalid ID
 * @returns {Error} 404 - Review not found
 */
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;
