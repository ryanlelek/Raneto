var UserModel = require('../models').User;
var userDao   = require('./user');
var normal    = require('../tools/normal');
var mail      = require('../tools/mail');
var cryptoer  = require('../tools/cryptoer');
var auth      = require('./auth/auth.service');

var _s        = require('underscore.string'),
    moment    = require('moment'),
    extend    = require('extend'),
    raneto    = require('raneto-core'),
    marked    = require('marked'),
    config    = require('./config'),
    path      = require('path'),
    fs        = require('fs'),
    validator = require('validator');

var eventproxy = require('eventproxy');
var async      = require('async');

extend(raneto.config, config);

/**
 * active email
 */
exports.activeEmail = function (req, res, next) {
  var key      = req.query.key,
      aesEmail = req.query.name;
  if (!key || !aesEmail) {
    return res.send('链接错误');
  }
  var email = cryptoer.aesDecrypt(aesEmail, config.session_secret);
  userDao.getByQuery({email : email}, {}, {}, function (err, models) {
    if (err) return next(err);
    var _user = models[0];
    if (!_user) {
      return next(new Error('***active_account*** not have such user: ' + email));
    }
    var bk_msg = {errcode : 1, msg : '信息有误，帐号无法被激活。'};
    if (!_user || cryptoer.md5(email + config.session_secret) !== key) {
      return res.json(bk_msg);
    }
    if (_user.isActive) {
      bk_msg.msg = '您的帐号已经是激活状态。';
      return res.json(bk_msg);
    }
    var sepTime = new Date() - _user.meta.createAt;
    if (sepTime > 1000 * 60 * 60 * 24) {
      bk_msg.msg = '链接超时，请重新发起激活。';
      res.json(bk_msg);
    }
    userDao.update({email : email}, {isActive : 1}, {}, function (err, bk) {
      if (err) return next(err);
      res.writeHeader(200, {'Content-Type' : 'text/html;charset=UTF-8'});
      //<script>setInterval(function(){location.href='/auth'},3000);</script>
      res.write("<html><head><title>激活邮箱</title></head><body><p>验证成功，3秒后自动跳转到登陆界面！<a href='/auth'>手动跳转</a></p></body></html>")
    });
  });
};

/**
 * get / reset pass by email
 */
exports.showResetPass = function (req, res, next) {
  var key      = req.query.key,
      aesEmail = req.query.name;
  if (!key || !aesEmail) {
    return res.send('链接错误');
  }
  var email = cryptoer.aesDecrypt(aesEmail, config.session_secret);
  userDao.getByQuery({email : email}, {}, {}, function (err, models) {
    if (err) return next(err);
    var _user = models[0];
    if (!_user) {
      return next(new Error('***reset_pass*** not have such user: ' + email));
    }
    var bk_msg = {errcode : 1, msg : '信息有误，无法重置密码。'};
    if (!_user || cryptoer.md5(email + config.session_secret) !== key) {
      return res.json(bk_msg);
    }
    if (!_user.isActive) {
      bk_msg.msg = '此邮箱账号还未激活。';
      return res.json(bk_msg);
    }
    var sepTime = new Date() - _user.meta.updateAt;
    if (sepTime > 1000 * 60 * 60 * 24) {
      bk_msg.msg = '链接超时，请重新发起重置。';
      return res.json(bk_msg);
    }
    req.session._resetPassForEmail = email;
    res.render('reset', {
      email : email
    });
  })
};

/**
 * post / reset pass
 */
exports.resetPass = function (req, res, next) {
  var email  = req.body.email;
  var pass   = req.body.pass;
  var errObj = {errcode : 1, msg : ''};
  if (!email || !validator.isEmail(email) || email != req.session._resetPassForEmail) {
    errObj.msg = '提交信息错误！';
    return res.json(errObj);
  }
  if (!pass || pass.length < 6) {
    errObj.msg = '密码格式不正确！';
    return res.json(errObj);
  }
  //update pass
  normal.hashPass(pass, function (err, hash_pass) {
    if (err) return next(err);
    userDao.update({email : email}, {password : hash_pass}, {}, function (err, bk) {
      if (err) return next(err);
      res.json({
        errcode : 0,
        msg     : '密码修改成功！'
      });
    });
  });
};

/**
 * 登陆 / get
 */
exports.showAuth = function (req, res, next) {
  res.render('auth-local');
};

/**
 * define pages where not go to after login in
 * @type {string[]}
 */
var notRefer = [
  '/active_account',
  '/reset_pass',
  '/auth/updatePass',
  '/auth/loginout'
];

/**
 * 登陆 / post
 */
exports.auth = function (req, res, next) {
  var _body    = req.body;
  var email    = validator.trim(_body.email).toLowerCase(),
      password = validator.trim(_body.pass).toLowerCase();

  var errObj = {errcode : 1, msg : ''};
  if (!email || !validator.isEmail(email)) {
    errObj.msg = '邮箱不正确(必须使用顺顺邮箱)！';
    return res.json(errObj);
  }
  if (!password || password.length < 6) {
    errObj.msg = '密码不正确！！';
    return res.json(errObj);
  }
  var ep = new eventproxy();
  ep.fail(next);

  ep.on('login_error', function () {
    res.json(errObj);
  });

  userDao.getByQuery({email : email}, {}, {}, function (err, models) {
    if (err) return callback(err);
    var _user = models[0] || null;
    if (!_user) {
      errObj.msg = '邮箱不存在';
      return ep.emit('login_error');
    }
    if (!_user.isActive) {
      errObj.msg = '邮箱未激活';
      return ep.emit('login_error');
    }

    userDao.extends.comparePassword(password, _user.password, function (err, isMatch) {
      if (err) return callback(err);
      if (!isMatch) {
        errObj.msg = '密码不正确';
        return ep.emit('login_error');
      }
      // login success, generate session
      auth.generateSession(_user, res);
      req.session.session_user = _user;
      var redirect_url         = req.session._loginReferer || '/';
      // validate refer page
      for (var i = 0, len = notRefer.length; i !== len; ++i) {
        if (redirect_url.indexOf(notRefer[i]) >= 0) {
          redirect_url = '/';
          break;
        }
      }
      res.json({errcode : 0, msg : '登录成功', model : _user, refer : redirect_url});
    });
  });
};

/**
 * 注册
 */
exports.signup = function (req, res, next) {
  var _body  = req.body;
  var email  = validator.trim(_body.email).toLowerCase(),
      pass   = validator.trim(_body.pass).toLowerCase(),
      rePass = validator.trim(_body.repPass).toLowerCase();

  var errObj = {
    errcode : 1, msg : ''
  };
  //validate params
  if (!email || !validator.isEmail(email)) {
    errObj.msg = '请输入正确邮箱(必须使用顺顺邮箱)';
    return res.json(errObj);
  }
  if (!pass || !rePass || pass !== rePass) {
    errObj.msg = '密码不正确';
    return res.json(errObj);
  }

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('take_err', function () {
    res.json(errObj);
  });

  normal.hashPass(pass, function (err, hash_pass) {
    if (err) return next(err);
    userDao.getByQuery({email : email}, {}, {}, function (err, models) {
      if (err) return next(err);
      if (models.length > 0) {
        errObj.msg = '邮箱已被注册';
        return ep.emit('take_err');
      }
      var _user = new UserModel({email : email, password : hash_pass});
      _user.save(function (err, user) {
        if (err)console.log(err);
      });
      mail.sendActiveMail(email, cryptoer.md5(email + config.session_secret), cryptoer.aesEncrypt(email, config.session_secret));
      res.json({
        errcode : 0,
        msg     : '欢迎使用 ' + config.site_title + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'
      });
    });
  });

};

/**
 * 找回密码 / post
 */
exports.forgotPass = function (req, res, next) {
  var email  = validator.trim(req.body.email).toLowerCase(),
      errObj = {errcode : 0, msg : ''};
  if (!email || !validator.isEmail(email)) {
    errObj.msg = '邮箱不正确！';
    return res.json(errObj);
  }
  userDao.getByQuery({email : email}, {}, {}, function (err, _ms) {
    if (err) return next(err);
    if (_ms.length <= 0) {
      errObj.msg = '邮箱不存在！';
      return ep.emit('take_err');
    }
    var _user = _ms[0];
    if (!_user.isActive) {
      errObj.msg = '邮箱未激活！';
      return ep.emit('take_err');
    }
    userDao.update({email : email}, {'meta.updateAt' : Date.now()}, {}, function (err, bk) {
      if (err) console.log(err);
    });
    //发送邮件
    mail.sendResetPassMail(email, cryptoer.md5(email + config.session_secret), cryptoer.aesEncrypt(email, config.session_secret));
    res.json({
      errcode : 0,
      msg     : '欢迎使用 ' + config.site_title + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来重置密码。'
    });
  })
};

exports.showUp = function (req, res, next) {
  res.render('modify-pass');
};

/**
 * 修改密码 / post
 * @returns {Object|*}
 */
exports.updatePass = function (req, res, next) {
  var bodyObj = req.body;

  var oldPass = validator.trim(bodyObj['oldPass']).toLowerCase() || '',
      newPass = validator.trim(bodyObj['newPass']).toLowerCase() || '',
      repPass = validator.trim(bodyObj['newRepPass']).toLowerCase() || '';
  var ep      = new eventproxy();
  ep.fail(next);

  var errObj = {errcode : 1, msg : ''};
  var _id    = req.session.session_user._id;
  ep.on('pass_err', function () {
    res.json(errObj);
  });

  if (!oldPass || oldPass.length < 6 || !newPass || newPass.length < 6 || !repPass || repPass.length < 6) {
    errObj.msg = '密码信息错误！';
    return ep.emit('pass_err');
  }

  var deps = {
    //get user password
    getUserHashPass : function (callback) {
      userDao.getById(_id, function (err, user) {
        callback(err, user.password);
      });
    },
    //compare twice pass
    comparePass     : ['getUserHashPass', function (callback, data) {
      userDao.extends.comparePassword(oldPass, data['getUserHashPass'], function (err, isMatch) {
        if (isMatch) {
          normal.hashPass(newPass, function (err, hashP) {
            callback(err, hashP);
          });
        } else {
          callback(null, 0);
        }
      });
    }],
    updateUserPass  : ['comparePass', function (callback, data) {
      var hashNewPass = data['comparePass'];
      if (hashNewPass) {
        userDao.update({_id : _id}, {password : hashNewPass}, {}, function (err, bk) {
          if (err) return next(err);
          errObj.errcode = 0;
          errObj.msg     = '修改成功！';
          res.json(errObj);
        });
      } else {
        //旧密码错误
        errObj.msg = '旧密码错误！';
        res.json(errObj);
      }
    }]
  };
  async.auto(deps);
};


/**
 * content list
 */
exports.list = function (req, res, next) {

  if (req.query.search) {
    var searchQuery    = validator.toString(validator.escape(_s.stripTags(req.query.search))).trim(),
        searchResults  = raneto.doSearch(searchQuery),
        pageListSearch = raneto.getPages('');

    return res.render('search', {
      config        : config,
      pages         : pageListSearch,
      search        : searchQuery,
      searchResults : searchResults,
      body_class    : 'page-search'
    });
  }
  else if (req.params[0]) {
    var slug = req.params[0];
    if (slug == '/') slug = '/index';

    var pageList = raneto.getPages(slug),
        filePath = path.normalize(raneto.config.content_dir + slug);
    if (!fs.existsSync(filePath)) filePath += '.md';

    if (slug == '/index' && !fs.existsSync(filePath)) {
      return res.render('home', {
        config     : config,
        pages      : pageList,
        body_class : 'page-home'
      });
    } else {
      fs.readFile(filePath, 'utf8', function (err, content) {
        if (err) {
          err.status  = '404';
          err.message = 'Whoops. Looks like this page doesn\'t exist.';
          return next(err);
        }

        // Process Markdown files
        if (path.extname(filePath) == '.md') {
          // File info
          var stat = fs.lstatSync(filePath);
          // Meta
          var meta = raneto.processMeta(content);
          content  = raneto.stripMeta(content);
          if (!meta.title) meta.title = raneto.slugToTitle(filePath);
          // Content
          content  = raneto.processVars(content);
          var html = marked(content);

          return res.render('page', {
            config        : config,
            pages         : pageList,
            meta          : meta,
            content       : html,
            body_class    : 'page-' + raneto.cleanString(slug),
            last_modified : moment(stat.mtime).format('Do MMM YYYY')
          });
        } else {
          // Serve static file
          res.sendfile(filePath);
        }
      });
    }
  } else {
    next();
  }
};


exports.loginout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, {path : '/'});
  res.redirect('/');
};
