const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Board Game API',
    description: 'CSE 341 Weeks 3 and 4 assignment'
  },
  host: '',
  schemes: ['']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);



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


