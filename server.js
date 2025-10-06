const express = require('express');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
require('dotenv').config();
const port = process.env.PORT || 8080;

const app = express();

// Basic logging middleware
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Middleware
app.use(cors());
app.use(express.json()); // built-in body parser

// Session setup (simple in-memory for class; use connect-mongo for production)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());


// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:8080/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // For class purposes, just pass user profile object through.
      // You could save it to Mongo here if you want (User.findOneAndUpdate...)
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.use('/', require('./routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// --- AUTH ROUTES ---
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/secrets',
    failureRedirect: '/login-failure',
  })
);

app.get('/secrets', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('✅ Logged in! Welcome, ' + req.user.displayName);
  } else {
    res.status(401).send('🚫 Not authenticated');
  }
});

app.get('/login-failure', (req, res) => {
  res.send('Login failed');
});

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.send('You have been logged out.');
    });
  });
});

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
