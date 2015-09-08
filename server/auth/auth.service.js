'use strict';

var config = require('../config');

exports.loginRequired = function (req, res, next) {
  //delete req.session.session_user;
  if (!req.session || !req.session.session_user) {
    var msg = '<html><head><title>没有登陆</title></head><body><p>还没登陆，3秒自动跳转，也可以点我！<a href=/auth/login">登陆</a></p><script>setInterval(function(){location.href="/auth/login"},3000);</script></body></html>';
    return res.status(403).send(msg);
  } else {
    next();
  }
};

function generateSession(user, res) {
  var auth_token = user._id + '***' + user.email;
  res.cookie(config.auth_cookie_name, auth_token,
    {path : '/', maxAge : config.cookieMaxAge, signed : true, httpOnly : true});
}
exports.generateSession = generateSession;
