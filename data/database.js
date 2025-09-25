const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let database;

const initDb = (callback) => {
  if (database) {
    console.log('Db is already initialized!');
    return callback(null, database);
  }

  console.log('Connecting to', process.env.MONGODB_URL);
  MongoClient.connect(process.env.MONGODB_URL)
    .then((client) => {
      // use your actual database name here
      database = client.db('project3');
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database;
};

module.exports = {
  initDb,
  getDb
};
