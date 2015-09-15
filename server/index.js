'use strict';

var express      = require('express'),
    path         = require('path'),
    favicon      = require('static-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),
    config       = require('./config'),
    app          = express();

var webRouter  = require('../routers/webRouter');
var mdRouter   = require('../routers/mdRouter');
var MongoStore = require('connect-mongo')(session);

// Setup views
app.set('views', path.join(__dirname, '../views'));
app.set('layout', 'layout');
app.set('view engine', 'html');
app.enable('view cache');
app.engine('html', require('hogan-express'));

// Setup Express
app.use(favicon(__dirname + '/../public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser(config.session_secret));
//app.use(cookieParser());
app.use(session({
  secret            : config.session_secret,
  store             : new MongoStore({url : config.mongodb.db}),
  resave            : true,
  saveUninitialized : true,
  cookie            : {maxAge : 1000 * 60 * 60}
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/auth', webRouter);
app.use('/', mdRouter);

// Handle any errors
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    config     : config,
    status     : err.status,
    message    : err.message,
    error      : {},
    body_class : 'page-error'
  });
});

module.exports = app;
