const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json'; // where swagger-autogen will save the generated JSON
const endpointsFiles = ['./routes/games.js', './routes/users.js', './routes/reviews.js']; // all route files

const doc = {
  info: {
    title: 'Board Game API',
    description: 'API for managing board games, users, and reviews',
  },
  host: 'cse341-boardgameapi.onrender.com',
  schemes: ['https'],
  definitions: {
    Game: {
      title: 'Memoir \'44',
      publisher: 'Days of Wonder',
      yearPublished: 2004,
      minPlayers: 2,
      maxPlayers: 2,
      playTime: 60,
      complexity: 'Medium',
      genre: 'Wargame, Scenario-based',
      description: 'A historical WWII board game where players reenact battles using miniatures and terrain maps.',
      reviews: ['68d53b299abd2a312f71464f']
    },
    User: {
      username: 'holly',
      email: 'holly@example.com',
      password: 'securePassword123'
    },
    Review: {
      userId: '68d539f99abd2a312f714648',
      gameId: '68d539a09abd2a312f714637',
      rating: 5,
      comment: 'Love this game!'
    }
  }
};

swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log('Swagger documentation generated successfully!');
    // optionally, you can start your server here if you like
    // require('./server.js');
  })
  .catch(err => console.error('Error generating swagger docs:', err));
