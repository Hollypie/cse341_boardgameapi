const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Hello Board Game World');
});

router.use('/games', require('./games'));
router.use('/users', require('./users'));
router.use('/reviews', require('./reviews'));

module.exports = router;
