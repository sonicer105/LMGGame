let express = require('express'),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home/index', { title: 'Sailex Tech LTT Game' });
});

module.exports = router;
