var should   = require('should');
var config   = require('../../server/config');
var app      = require('../../server');
var request  = require('supertest')(app);
var mm       = require('mm');
var pedding  = require('pedding');
var mailer   = require('../../tools/mail');
var userDao  = require('../../server/user');
var cryptoer = require('../../tools/cryptoer');

describe('test/server/site.test.js', function () {
  var email = 'noodleswang@shunshunliuxue.com';
  var testE = 'test@shunshunliuxue.com';

  afterEach(function () {
    mm.restore();
  });

  describe('site page', function () {
    it('should / 302', function (done) {
      request.get('/').end(function (err, res) {
        res.status.should.equal(302);
        res.text.should.containEql('/auth');
        done(err);
      });
    });

    it('should /list/* 302', function (done) {
      request.get('/list/!*').end(function (err, res) {
        res.status.should.equal(302);
        res.text.should.containEql('/auth');
        done(err);
      });
    });
  });

  describe('register', function () {
    it('should register a new user', function (done) {
      done = pedding(2, done);
      mm(mailer, 'sendMail', function (data) {
        data.to.should.match(new RegExp('@shunshunliuxue.com'));
        done();
      });
      request.post('/auth/signup')
        .send({
          email   : testE,
          pass    : 'test123',
          repPass : 'test123'
        })
        .expect(200, function (err, res) {
          should.not.exist(err);
          res.text.should.containEql('');
          userDao.getByQuery({email : email}, {}, {}, function (err, ms) {
            should.not.exist(err);
            ms.should.ok;
            ms.should.have.length(1);
            done();
          });
        });
    });
    it('should error if has not email POST /auth/signup', function (done) {
      request.post('/auth/signup').send({
        email   : '',
        pass    : '',
        repPass : ''
      }).end(function (err, res) {
        res.status.should.equal(200);
        res.text.should.containEql('请输入正确邮箱');
        done(err);
      });
    });
    it('should error if has not pass POST /auth/signup', function (done) {
      request.post('/auth/signup').send({
        email   : 'test@test.com',
        pass    : '',
        repPass : 'ddd'
      }).end(function (err, res) {
        res.status.should.equal(200);
        res.text.should.containEql('密码不正确');
        done(err);
      });
    });
    it('should return used email POST /auth/signup', function (done) {
      request.post('/auth/signup').send({
        email   : email,
        pass    : 'aaaaaa',
        repPass : 'aaaaaa'
      }).expect(200, done);
    })
  });

  describe('login in', function () {
    it('should visit login page and GET /auth 200', function (done) {
      request.get('/auth')
        .end(function (err, res) {
          res.status.should.equal(200);
          done(err);
        });
    });
    it('should error if has not email and POST /auth ', function (done) {
      request.post('/auth').send({
        email : '',
        pass  : ''
      }).end(function (err, res) {
        res.status.should.equal(200);
        res.text.should.containEql('邮箱不正确');
        done(err);
      });
    });
    it('should error if has not password and POST /auth ', function (done) {
      request.post('/auth').send({
        email : email,
        pass  : ''
      }).end(function (err, res) {
        res.status.should.equal(200);
        res.text.should.containEql('密码不正确');
        done(err);
      });
    });
    it('should not have email  POST /auth ', function (done) {
      request.post('/auth').send({
        email : 'test@shunshun.com',
        pass  : '333333'
      }).end(function (err, res) {
        res.status.should.equal(200);
        res.text.should.containEql('邮箱不存在');
        done(err);
      });
    });
    it('should not actived email  POST /auth ', function (done) {
      request.post('/auth').send({
        email : email,
        pass  : '999999'
      }).end(function (err, res) {
        res.status.should.equal(200);
        res.text.should.containEql('邮箱未激活');
        done(err);
      });
    });
    it('should pass invalidate POST /auth ', function (done) {
      request.post('/auth').send({
        email : 'boatwww@icloud.com',
        pass  : '9999999'
      }).end(function (err, res) {
        res.status.should.equal(200);
        res.text.should.containEql('密码不正确');
        done(err);
      });
    });
    it('should success login POST /auth ', function (done) {
      request.post('/auth').send({
        email : 'boatwww@icloud.com',
        pass  : '999999'
      }).end(function (err, res) {
        res.status.should.equal(200);
        res.text.should.containEql('登录成功');
        done(err);
      });
    })
  });

  describe('login out', function () {
    it('should login out POST / loginout', function (done) {
      request.post('/auth/loginout')
        .set('Cookie', config.auth_cookie_name + '$hahaha')
        .expect(302, function (err, res) {
          res.headers['set-cookie'].should.eql(['shunshun=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT']);
          done(err);
        });
    });
  });

  describe('have user is actived', function () {
    it('should active email POST /active_account', function (done) {
      var key  = cryptoer.md5(testE + config.session_secret);
      var name = cryptoer.aesEncrypt(testE, config.session_secret);
      request.get('/active_account')
        .query({
          key  : key,
          name : name
        })
        .expect(200, function (err, res) {
          res.text.should.containEql('激活邮箱');
          done(err);
        });
    });
  });

  describe('about pass', function () {
    it('should GET /reset_pass 200', function (done) {
      var key  = cryptoer.md5(testE + config.session_secret);
      var name = cryptoer.aesEncrypt(testE, config.session_secret);
      request.get('/reset_pass')
        .query({
          key   : key,
          email : name
        })
        .expect(200, function (err, res) {
          res.text.should.containEql('链接错误');
          done(err);
        });
    });

    it('should reset pass', function (done) {
      request.post('/reset_pass')
        .send({
          email : testE,
          pass  : '123456'
        })
        .expect(200, function (err, res) {
          res.text.should.containEql('提交信息错误！');
          done(err);
        });
    });

  });

  describe('forget pass', function () {
    it('should ', function (done) {

    })
  });
  after(function () {
    userDao.delete({email : testE}, function (err, bk) {
      should.not.exist(err);
    });
  });
});
