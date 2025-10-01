const router = require('express').Router();
const passport = require('passport');

router.get('/', (req, res) => {
  res.send('Hello Board Game World');
});

router.use('/games', require('./games'));
router.use('/users', require('./users'));
router.use('/reviews', require('./reviews'));

router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
  });
});

module.exports = router;
