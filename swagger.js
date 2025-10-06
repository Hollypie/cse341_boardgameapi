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
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Memoir \'44'
        },
        publisher: {
          type: 'string',
          example: 'Days of Wonder'
        },
        yearPublished: {
          type: 'number',
          example: 2004
        },
        minPlayers: {
          type: 'number',
          example: 2
        },
        maxPlayers: {
          type: 'number',
          example: 2
        },
        playTime: {
          type: 'number',
          example: 60
        },
        complexity: {
          type: 'string',
          example: 'Medium'
        },
        genre: {
          type: 'string',
          example: 'Wargame, Scenario-based'
        },
        description: {
          type: 'string',
          example: 'A historical WWII board game.'
        },
        reviews: {
          type: 'array',
          items: {},
          example: []
        }
      }
    },
    User: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'holly'
        },
        email: {
          type: 'string',
          example: 'holly@example.com'
        },
        password: {
          type: 'string',
          example: 'securePassword123'
        }
      }
    },
    Review: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          example: '68d539f99abd2a312f714648'
        },
        gameId: {
          type: 'string',
          example: '68d539a09abd2a312f714637'
        },
        rating: {
          type: 'number',
          example: 5
        },
        comment: {
          type: 'string',
          example: 'Love this game!'
        }
      }
    }
  }
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});