const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Hello Board Game World');
});

router.use('/games', require('./games'));

module.exports = router;
