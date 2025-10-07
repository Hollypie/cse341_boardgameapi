const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login route
router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// OAuth callback route
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failure' }),
  (req, res) => {
    // Save session before redirecting
    req.session.save(() => res.redirect('/secrets'));
  }
);

// Protected route
router.get('/secrets', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`
      <h1>✅ Successfully Logged In!</h1>
      <p>Welcome, ${req.user.displayName}</p>
      <p>Email: ${req.user.emails?.[0]?.value}</p>
      <p><a href="/logout">Logout</a></p>
    `);
  } else {
    res.status(401).send(`
      <h1>🚫 Not Authenticated</h1>
      <p><a href="/login">Log in with Google</a></p>
    `);
  }
});

// Logout route
router.get('/logout', (req, res, next) => {
  const username = req.user?.displayName;
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(err => {
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

// Login failure
router.get('/login-failure', (req, res) => {
  res.status(401).send(`
    <h1>⚠️ Login Failed</h1>
    <p><a href="/login">Try again</a></p>
  `);
});

module.exports = router;
