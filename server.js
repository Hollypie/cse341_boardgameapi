const express = require('express');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const port = process.env.PORT || 8080;

const app = express();

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Authenticated:', req.isAuthenticated ? req.isAuthenticated() : 'N/A');
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Session setup 
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL, 
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Check environment variables on startup
console.log('🔍 Environment Check:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || '✗ Missing');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✓ Set' : '✗ Missing');
console.log('MONGODB_URL:', process.env.MONGODB_URL ? '✓ Set' : '✗ Missing');

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('✅ Google auth successful for:', profile.displayName);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('📝 Serializing user:', user.displayName);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('📖 Deserializing user:', user.displayName);
  done(null, user);
});

// Routes
app.use('/', require('./routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- AUTHENTICATION ROUTES ---

// Login route with error handling
app.get('/login', (req, res, next) => {
  console.log('🔐 Login route hit');
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    failureRedirect: '/login-failure'
  })(req, res, next);
});

// OAuth callback route with detailed logging
app.get(
  '/auth/google/callback',
  (req, res, next) => {
    console.log('📞 Callback received from Google');
    next();
  },
  passport.authenticate('google', {
    successRedirect: '/secrets',
    failureRedirect: '/login-failure',
  }),
  (err, req, res, next) => {
    console.error('❌ Auth callback error:', err);
    res.redirect('/login-failure');
  }
);

// Protected test route
app.get('/secrets', (req, res) => {
  console.log('🔒 Secrets route - Authenticated:', req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.status(200).send(`✅ Logged in! Welcome, ${req.user.displayName}`);
  } else {
    res.status(401).send('🚫 Not authenticated. Please <a href="/login">log in</a>.');
  }
});

// Login failure route
app.get('/login-failure', (req, res) => {
  console.log('❌ Login failure route hit');
  res.status(401).send('⚠️ Login failed. <a href="/login">Try again</a>.');
});

// Logout route
app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).send('You have been logged out. <a href="/login">Log in again</a>');
    });
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err);
  res.status(500).send('Internal server error');
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