const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Board Game API',
    description: 'CSE 341 Weeks 3 and 4 assignment',
    version: '1.0.0'
  },
  host: 'cse341-boardgameapi.onrender.com',
  basePath: '/',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger file generated successfully!');
  console.log('Host:', doc.host);
  console.log('Schemes:', doc.schemes);
});

// const swaggerAutogen = require('swagger-autogen')();

// const doc = {
//   info: {
//     title: 'Board Game API',
//     description: 'CSE 341 Weeks 3 and 4 assignment',
//   },
//   host: process.env.HOST || 'localhost:8080',
//   schemes: process.env.SCHEMES ? process.env.SCHEMES.split(',') : ['http'],
// };

// const outputFile = './swagger.json';
// const endpointsFiles = ['./routes/index.js'];

// swaggerAutogen(outputFile, endpointsFiles, doc);


