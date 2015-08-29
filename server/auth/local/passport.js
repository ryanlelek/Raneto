'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User) {

  passport.use(new LocalStrategy(
    function(username, password, cb) {
      console.log(username, password);
      User.findOne({username: username}, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        return cb(null, user);
      });
    }
  ));
};
