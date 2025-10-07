const swaggerAutogen = require('swagger-autogen')();
const { execSync } = require('child_process');

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
      name: 'Newgame',
      description: 'Updated game example for PUT operations'
    },
    {
      name: 'Authentication',
      description: 'OAuth login/logout endpoints'
    }
  ]
  // Don't define schemas here - they're defined in fix-swagger.js
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
  
  // Run the fix script
  try {
    execSync('node fix-swagger.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error fixing swagger:', error);
  }
});