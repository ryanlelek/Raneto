var mailer = require('nodemailer');
var config = require('../server/config');
//var log4js = require('./logger');
var util = require('util');

var transport = mailer.createTransport(config.mail_opts);
var ROOT_URL = 'http://' + config.host;

var sendMail = function (mailObj) {
  console.log('xxxxxxemail......'+mailObj.html);
  transport.sendMail(mailObj, function (err) {
    if (err) {
      //log4js.error('send mail error: ', error);
      console.log(err);
    }
  });
};

exports.sendMail = sendMail;

exports.sendActiveMail = function (to, token, name) {
  var from = util.format('%s ✔ <%s>', config.site_title, config.mail_opts.auth.user);
  var sub = config.site_title + '用户激活';
  var html = '<p>您好：' + name + '</p><p>收到您在' + config.site_title + '注册信息，请点击下面的链接来激活帐户：</p>' +
    '<a href="' + ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>';

  exports.sendMail({
    from: from,
    to: to,
    subject: sub,
    html: html
  });
};

exports.sendResetPassMail = function (to, token, name) {
  var from = util.format('%s @ <%s>', config.site_title, config.mail_opts.auth.user);
  var sub = config.site_title + '网站用户密码重置';
  var html = '<p>您好：' + name + '</p>' +
    '<p>收到您在' + config.site_title + '重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>' +
    '<a href="' + ROOT_URL + '/reset_pass?key=' + token + '&name=' + name + '">重置密码链接</a>';

  exports.sendMail({
    from: from,
    to: to,
    subject: sub,
    html: html
  });
};
