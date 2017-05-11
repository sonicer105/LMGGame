let express = require('express'),
    router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home/index', { title: 'LTT Game', navSection: 0 });
});

/* GET game page */
router.get('/game', function(req, res, next) {
    res.render('home/game', { title: 'LTT Game', navSection: 1 });
});

module.exports = router;
