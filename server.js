const express = require('express');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const port = process.env.PORT || 8080;

const app = express();

// Middleware
app.use(express.json()); // built-in body parser
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
app.use('/', require('./routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global error handler for uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err}\nException origin: ${origin}`);
});

// Connect to MongoDB and start server
mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on port ${port}`);
    });
  }
});
