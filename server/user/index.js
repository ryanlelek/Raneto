
var CommonDao = require('../../tools/dao');
var UserModel = require('../../models/index').User;
var bcrypt = require('bcrypt');

var UserDao = new CommonDao(UserModel);

UserDao.extends = {
  comparePassword: function (_password, hash, callback) {
    bcrypt.compare(_password, hash, function (err, isMatch) {
      if (err) return callback(err);
      callback(null, isMatch);
    });
  }
};

module.exports = UserDao;
