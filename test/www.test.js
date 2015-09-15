var request = require('supertest');
var app = require('../server');
var config = require('../server/config');

describe('test/www.test.js', function () {
  it('request should return status 403 before login', function (done) {
    request(app).get('/').end(function (err, res) {
      res.status.should.equal(403);
      done();
    });
  });
});
