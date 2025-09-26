const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await mongodb.getDb().collection('reviews').find().toArray();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Fetching reviews failed.' });
  }
};

// GET a single review by ID
const getSingleReview = async (req, res) => {
  try {
    let reviewId;
    try {
      reviewId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid review ID format.' });
    }

    const review = await mongodb.getDb().collection('reviews').findOne({ _id: reviewId });
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Fetching review failed.' });
  }
};

// CREATE a new review
const createReview = async (req, res) => {
  try {
    const { userId, gameId, rating, comment } = req.body;
    if (!userId || !gameId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const review = { userId, gameId, rating, comment };

    const response = await mongodb.getDb().collection('reviews').insertOne(review);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create review.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Unexpected error.' });
  }
};

// UPDATE an existing review
const updateReview = async (req, res) => {
  try {
    let reviewId;
    try {
      reviewId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid review ID format.' });
    }

    const { userId, gameId, rating, comment } = req.body;
    if (!userId || !gameId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const updateDoc = {
        $set: {
            userId,
            gameId,
            rating,
            comment
        }
    };

    const response = await mongodb.getDb()
        .collection('reviews')
        .updateOne({ _id: reviewId }, updateDoc);

    console.log("Updating review:", reviewId);
    console.log("UpdateDoc:", JSON.stringify(updateDoc, null, 2));

    if (response.matchedCount === 0) {
        return res.status(404).json({ message: 'Review not found.' });
    }

    return res.status(200).json({ message: 'Review updated successfully.' });

  } catch (err) {
    res.status(500).json({ message: err.message || 'Unexpected error.' });
  }
};

// DELETE a review
const deleteReview = async (req, res) => {
  try {
    let reviewId;
    try {
      reviewId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid review ID format.' });
    }

    const response = await mongodb.getDb().collection('reviews').deleteOne({ _id: reviewId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Review not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Unexpected error.' });
  }
};

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview
};

