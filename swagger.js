const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = [
  './routes/index.js',
  './routes/auth.js',
  './routes/reviews.js',
  './routes/users.js',
  './routes/games.js'
];

const doc = {
  info: {
    title: 'Board Game API',
    description: 'API for managing board games, users, and reviews',
  },
  host: 'cse341-boardgameapi.onrender.com',
  schemes: ['https'],
  tags: [
    {
      name: 'Games',
      description: 'Game management endpoints'
    },
    {
      name: 'Authentication',
      description: 'OAuth login/logout endpoints'
    }
  ],
  definitions: {
    Game: {
      title: 'Memoir \'44',                // string
      publisher: 'Days of Wonder',         // string
      yearPublished: 2004,                 // number
      minPlayers: 2,                       // number
      maxPlayers: 2,                       // number
      playTime: 60,                        // number
      complexity: 'Medium',                // string
      genre: 'Wargame, Scenario-based',    // string
      description: 'A historical WWII board game.', // string
      reviews: []                           // array
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

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});
