const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Board Game API',
    description: 'CSE 341 Weeks 3 and 4 assignment',
  },
  // Use your Render production URL here
  host: 'cse341-boardgameapi.onrender.com',
  schemes: ['https'], // since Render uses HTTPS
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
