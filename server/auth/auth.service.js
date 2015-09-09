'use strict';

var config = require('../config');

exports.loginRequired = function (req, res, next) {
  //delete req.session.session_user;
  if (!req.session || !req.session.session_user) {
    var msg = '<html><head><title>没有登录</title></head><body><script>setTimeout(function(){location.href="/auth/login"},0);</script></body></html>';
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
