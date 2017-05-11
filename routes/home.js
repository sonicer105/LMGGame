let express = require('express'),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home/index', { title: 'LTT Game', navSection: 0 });
});

module.exports = router;
