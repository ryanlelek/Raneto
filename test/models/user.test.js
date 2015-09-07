var UserModel = require('../../models').User;

describe('test/models/user.test.js', function () {
  it('should return isActive', function () {
    var user = new UserModel({email:'test@sslx.com',password:'234@#$'});
    user.isActive.should.eql(0);
  });
});
