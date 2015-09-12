var request = require('supertest');
var app = require('../server');
var config = require('../server/config');

describe('test/www.test.js', function () {
  it('should / status 302', function (done) {
    request(app).get('/').end(function (err, res) {
      console.log(res);
      res.status.should.equal(302);
      res.text.should.containEql(config.site_title);
      done();
    });
  });
});
