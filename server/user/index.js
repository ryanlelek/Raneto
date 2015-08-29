exports.findOne = function(data, cb) {
  var user = {
    _id: 1,
    username: 'test',
    authenticate: function() {
      return true;
    }
  };
  cb(null, user);
}
