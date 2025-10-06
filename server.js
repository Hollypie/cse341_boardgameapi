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

// CRITICAL: Trust proxy - Render uses a proxy
app.set('trust proxy', 1);

console.log('='.repeat(50));
console.log('🔍 STARTUP ENVIRONMENT CHECK');
console.log('='.repeat(50));
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ MISSING');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ MISSING');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || '✗ MISSING');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✓ Set' : '✗ MISSING');
console.log('MONGODB_URL:', process.env.MONGODB_URL ? '✓ Set' : '✗ MISSING');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('Port:', port);
console.log('='.repeat(50));

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`\n📍 ${req.method} ${req.url}`);
  console.log('Session ID:', req.sessionID || 'none');
  console.log('Session:', req.session ? 'exists' : 'MISSING');
  console.log('User in session:', req.session?.passport?.user?.displayName || 'none');
  console.log('isAuthenticated:', req.isAuthenticated ? req.isAuthenticated() : 'N/A');
  next();
});

// Session setup with detailed logging
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-this',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60,
  }),
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  },
  proxy: true,
};

console.log('📦 Session Config:', {
  hasSecret: !!sessionConfig.secret,
  cookieSecure: sessionConfig.cookie.secure,
  cookieSameSite: sessionConfig.cookie.sameSite,
  proxy: sessionConfig.proxy
});

app.use(session(sessionConfig));

// Session event logging
app.use((req, res, next) => {
  if (req.session) {
    req.session.viewCount = (req.session.viewCount || 0) + 1;
    console.log('✅ Session is working - View count:', req.session.viewCount);
  } else {
    console.log('❌ NO SESSION OBJECT');
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('✅ Google OAuth Success!');
      console.log('User:', profile.displayName, profile.emails?.[0]?.value);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('📝 SERIALIZE USER:', user.displayName);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('📖 DESERIALIZE USER:', user.displayName);
  done(null, user);
});

// Routes
app.use('/', require('./routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- AUTHENTICATION ROUTES ---

// Login route
app.get('/login', (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Initiate Google OAuth login'
  // #swagger.description = 'Redirects user to Google OAuth consent screen'
  /* #swagger.responses[302] = {
    description: 'Redirects to Google for authentication'
  } */
  console.log('🔐 /login route hit - initiating Google OAuth');
  passport.authenticate('google', { 
    scope: ['profile', 'email']
  })(req, res, next);
});

// OAuth callback route
app.get(
  '/auth/google/callback',
  (req, res, next) => {
    console.log('📞 Google callback received');
    console.log('Query params:', Object.keys(req.query).join(', '));
    next();
  },
  passport.authenticate('google', {
    failureRedirect: '/login-failure',
  }),
  (req, res) => {
    console.log('✅ Auth successful, user object exists:', !!req.user);
    console.log('Session after auth:', req.sessionID);
    console.log('User:', req.user?.displayName);
    
    // Manually save session before redirect
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
        return res.redirect('/login-failure');
      }
      console.log('💾 Session saved successfully');
      res.redirect('/secrets');
    });
  }
);

// Protected test route
app.get('/secrets', (req, res) => {
  console.log('🔒 /secrets route');
  console.log('Session exists:', !!req.session);
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', JSON.stringify(req.session, null, 2));
  console.log('Passport in session:', !!req.session?.passport);
  console.log('User in session:', req.session?.passport?.user?.displayName);
  console.log('isAuthenticated():', req.isAuthenticated());
  console.log('req.user:', req.user?.displayName);
  
  if (req.isAuthenticated()) {
    res.status(200).send(`
      <h1>✅ Successfully Logged In!</h1>
      <p>Welcome, ${req.user.displayName}</p>
      <p>Email: ${req.user.emails?.[0]?.value}</p>
      <p><a href="/logout">Logout</a></p>
    `);
  } else {
    res.status(401).send(`
      <h1>🚫 Not Authenticated</h1>
      <p>Session ID: ${req.sessionID || 'none'}</p>
      <p>Session exists: ${!!req.session}</p>
      <p>Passport data: ${JSON.stringify(req.session?.passport || 'none')}</p>
      <p><a href="/login">Log in</a></p>
    `);
  }
});

// Login failure route
app.get('/login-failure', (req, res) => {
  console.log('❌ Login failure');
  res.status(401).send(`
    <h1>⚠️ Login Failed</h1>
    <p><a href="/login">Try again</a></p>
  `);
});

// Logout route
app.get('/logout', (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Logout current user'
  // #swagger.description = 'Destroys session and logs out the user'
  /* #swagger.responses[200] = {
    description: 'Successfully logged out',
    content: {
      "text/html": {
        schema: { type: "string" }
      }
    }
  } */
  console.log('👋 Logout initiated');
  const username = req.user?.displayName;
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) console.error('Session destroy error:', err);
      res.clearCookie('connect.sid');
      res.send(`
        <h1>Logged Out</h1>
        <p>Goodbye, ${username || 'user'}!</p>
        <p><a href="/login">Log in again</a></p>
      `);
    });
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err);
  res.status(500).send('Internal server error: ' + err.message);
});

// Uncaught exception handler
process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err}\nException origin: ${origin}`);
});

// Connect to MongoDB and start server
mongodb.initDb((err) => {
  if (err) {
    console.error('❌ MongoDB connection error:', err);
  } else {
    console.log('✅ MongoDB connected');
    app.listen(port, () => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`🚀 Server running on port ${port}`);
      console.log(`${'='.repeat(50)}\n`);
    });
  }
});