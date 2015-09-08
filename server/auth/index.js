'use strict';

var express = require('express');
var passport = require('passport');
var User = require('../user');
var router = express.Router();

// Passport Configuration
require('./local/passport').setup(User);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

router.use('/', require('./local'));

module.exports = router;
