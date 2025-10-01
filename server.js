const express = require('express');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const port = process.env.PORT || 8080;
const app = express();

// ============================================
// PASSPORT CONFIGURATION (before middleware)
// ============================================
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL || 'https://cse341-boardgameapi.onrender.com/github/callback'
},
  function (accessToken, refreshToken, profile, done) {
    // User authenticated successfully
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({ 
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session must be configured before passport
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false, // Changed to false for better security
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ============================================
// SWAGGER CONFIGURATION
// ============================================
// Clear cache and reload swagger.json
delete require.cache[require.resolve('./swagger.json')];
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve swagger.json directly for reference
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// ============================================
// ROUTES
// ============================================

// Root route
app.get('/', (req, res) => { 
  res.send(req.session.user !== undefined 
    ? `Logged in as ${req.session.user.displayName}` 
    : "Logged Out"
  ); 
});

// GitHub OAuth login route
app.get('/github', passport.authenticate('github', { 
  scope: ['user:email'] 
}));

// GitHub OAuth callback route
app.get('/github/callback', 
  passport.authenticate('github', {
    failureRedirect: '/api-docs'
  }),
  (req, res) => {
    // Store user in session
    req.session.user = req.user;
    res.redirect('/');
  }
);

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      res.redirect('/');
    });
  });
});

// API routes
app.use('/', require('./routes'));

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Uncaught exception handler
process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err}\nException origin: ${origin}`);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// ============================================
// START SERVER
// ============================================
mongodb.initDb((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on port ${port}`);
      console.log(`Swagger docs available at: http://localhost:${port}/api-docs`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
});