'use strict';

var express = require('express');
var passport = require('passport');
var router = express.Router();

router.post('/auth', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
   var error = err || info;
   if (error) return res.json(401, error);
   if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

   var token = user._id;
   res.json({token: token});
   })(req, res, next);
});

router.get('/auth', function (req, res) {
  res.render('auth-local');
});

module.exports = router;
