// Imports
let express = require('express'),
engine = require('ejs-locals'),
path = require('path'),
logger = require('morgan'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
sassMiddleware = require('node-sass-middleware'),

// Get the database
db = require('./db'),

// Views
home = require('./routes/home'),
api = require('./routes/api'),

// Init express app
app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true(.sass) false(.scss)
    sourceMap: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.use('/', home);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('errors/error-generic');
});

module.exports = app;
