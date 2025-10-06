const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/index.js'];

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
      title: 'Memoir \'44',
      publisher: 'Days of Wonder',
      yearPublished: 2004,
      minPlayers: 2,
      maxPlayers: 2,
      playTime: 60,
      complexity: 'Medium',
      genre: 'Wargame, Scenario-based',
      description: 'A historical WWII board game.',
      reviews: []
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
