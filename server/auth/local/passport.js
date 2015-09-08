'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var User = require('../../../models').User;

exports.setup = function (User) {
  passport.use(new LocalStrategy(
    function(email, password, cb) {
      User.findOne({email: email}, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password !== password) { return cb(null, false); }
        return cb(null, user);
      });
    }
  ));
};
