const express = require('express');
const router = express.Router();
const passport = require('passport');

// #swagger.tags = ['Authentication']
// #swagger.description = 'Google OAuth login route'
router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// #swagger.tags = ['Authentication']
// #swagger.description = 'OAuth callback route'
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/secrets');
});

// #swagger.tags = ['Authentication']
// #swagger.description = 'Logout route'
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
