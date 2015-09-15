var normal = require('../../tools/normal');
var should = require('should');
var userDao = require('../../server/user');

describe('test/tools/normal.test.js', function () {
  it('should hash password', function (done) {
    normal.hashPass('999999', function (err, hash) {
      should.not.exist(err);
      userDao.extends.comparePassword('999999',hash, function (err,isMatch) {
        should.not.exist(err);
        isMatch.should.equal(true);
        done();
      })
    });
  });

  it('should validate mail yes and not', function () {
    normal.validateEmail('noodleswang@shunshunliuxue.com').should.eql(true);
    normal.validateEmail('@shunshunliuxue.com').should.eql(false);
    normal.validateEmail('test@test.com').should.eql(false);
  });
});
