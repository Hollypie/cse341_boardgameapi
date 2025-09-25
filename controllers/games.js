const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GET all games
const getAll = async (req, res) => {
  try {
    const games = await mongodb.getDb().collection('games').find().toArray();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ message: 'Fetching games failed.' });
  }
};

// GET a single game by ID
const getSingle = async (req, res) => {
  try {
    let gameId;
    try {
      gameId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid game ID format.' });
    }

    const game = await mongodb.getDb().collection('games').findOne({ _id: gameId });
    if (!game) return res.status(404).json({ message: 'Game not found.' });

    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ message: 'Fetching game failed.' });
  }
};

// CREATE a new game
const createGame = async (req, res) => {
  try {
    const { title, publisher, yearPublished, minPlayers, maxPlayers, playTime, complexity, genre, description } = req.body;
    if (!title || !publisher || !yearPublished || !minPlayers || !maxPlayers || !playTime || !complexity || !genre || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const game = { title, publisher, yearPublished, minPlayers, maxPlayers, playTime, complexity, genre, description };

    const response = await mongodb.getDb().collection('games').insertOne(game);

    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create game.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Unexpected error.' });
  }
};

// UPDATE an existing game
const updateGame = async (req, res) => {
  try {
    let gameId;
    try {
      gameId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid game ID format.' });
    }

    const { title, publisher, yearPublished, minPlayers, maxPlayers, playTime, complexity, genre, description } = req.body;
    if (!title || !publisher || !yearPublished || !minPlayers || !maxPlayers || !playTime || !complexity || !genre || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const game = { title, publisher, yearPublished, minPlayers, maxPlayers, playTime, complexity, genre, description };

    const response = await mongodb.getDb().collection('games').replaceOne({ _id: gameId }, game);

    if (response.matchedCount === 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Game not found or nothing to update.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Unexpected error.' });
  }
};

// DELETE a game
const deleteGame = async (req, res) => {
  try {
    let gameId;
    try {
      gameId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid game ID format.' });
    }

    const response = await mongodb.getDb().collection('games').deleteOne({ _id: gameId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Game not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Unexpected error.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createGame,
  updateGame,
  deleteGame
};

