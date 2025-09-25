const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await mongodb.getDb().collection('users').find().toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Fetching users failed.' });
  }
};

// GET a single user by ID
const getSingleUser = async (req, res) => {
  try {
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const user = await mongodb.getDb().collection('users').findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Fetching user failed.' });
  }
};

// CREATE a new user
const createUser = async (req, res) => {
  try {
    const { username, email, reviews } = req.body;
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required.' });
    }

    const user = { username, email, reviews: Array.isArray(reviews) ? reviews : []  };

    const response = await mongodb.getDb().collection('users').insertOne(user);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create user.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Unexpected error.' });
  }
};

// UPDATE an existing user
const updateUser = async (req, res) => {
  try {
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const { username, email, reviews } = req.body;
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required.' });
    }

    const user = { username, email, reviews: Array.isArray(reviews) ? reviews : []  };

    const response = await mongodb.getDb().collection('users').replaceOne({ _id: userId }, user);

    if (response.matchedCount === 0) {
      res.status(200).send();
    } else {
      res.status(404).json({ message: 'User not found or nothing to update.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Unexpected error.' });
  }
};

// DELETE a user
const deleteUser = async (req, res) => {
  try {
    let userId;
    try {
      userId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const response = await mongodb.getDb().collection('users').deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Unexpected error.' });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
};

