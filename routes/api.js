//TODO: This file will be a scoreboard api for the game in the future. Does nothing currently.

let express = require('express'),
    router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;