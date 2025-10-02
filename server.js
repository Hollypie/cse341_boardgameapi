const express = require('express');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
const port = process.env.PORT || 8080;

const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});


// Middleware
app.use(cors());
app.use(express.json()); // built-in body parser


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
