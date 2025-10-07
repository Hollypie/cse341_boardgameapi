const router = require('express').Router();

router.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Board Game API</h1>
    <p><a href="/login">Log in with Google</a></p>
  `);
});

router.use('/games', require('./games'));
router.use('/users', require('./users'));
router.use('/reviews', require('./reviews'));

module.exports = router;
