
var bcrypt = require('bcrypt');
var config = require('../server/config');

exports.hashPass = function (password, callback) {
  bcrypt.genSalt(config.salt_factor, function (err, salt) {
    bcrypt.hash(password,salt, function (err, hash) {
      callback(null,hash);
    });
  });
};

exports.validateEmail = function (email) {
  var reg = /^\w+@shunshunliuxue.com$/;
  return reg.test(email);
};
