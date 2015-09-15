(function ($, hljs) {

  'use strict';

  $(document).ready(function () {

    if ($('.content').length) {

      // Syntax highlighting
      hljs.initHighlightingOnLoad();

      // Add Bootstrap styling to tables
      $('.content table').addClass('table');

      // FitVids
      $('.content').fitVids();

    }

    if ($('.home-categories').length) {
      $('.home-categories').masonry({
        columnWidth: '.col',
        itemSelector: '.col',
        transitionDuration: 0
      });
    }

    //---
    //added
    //---
    var tips = $('#helpBlock').text('');
    var commonFunc = function (name, title, that) {
      tips.text('');
      $(that).parent('form').hide();
      $('.form-' + name).show();
      $('.form-title').html(title);
    };
    var beBind = function (obj) {
      return function (func) {
        return function () {
          var args = Array.prototype.slice.call(arguments);
          args[args.length] = args[0]==='register'?obj.parent():obj;
          obj.click(function () {
            func.apply(obj,args);
          });
        };
      };
    };
    beBind($('.back-login'))(commonFunc)('login', '登录');
    beBind($('.signup'))(commonFunc)('register','账号注册');
    beBind($('.forget-pass'))(commonFunc)('forgot','找回密码');
    beBind($('.update-pass'))(commonFunc)('update','修改密码');

    var validateList = {
      notNull: function (value) {
        return value.trim() !== '';
      },
      minLength: function (value, minLen) {
        return value.length >= minLen;
      },
      maxLength: function (value, maxLen) {
        return value.length <= maxLen;
      },
      emailRegExp: function (value, exp) {
        return exp.test(value);
      },
      equal: function (val1, val2) {
        return val1.trim() === val2.trim();
      }
    };

    var addValidate = function (ele, obj) {
      var ssh = true;
      for (var key in obj) {
        var flag = validateList[key](ele.val(), obj[key]);
        if (!flag) {
          ssh = false;
          break;
        }
      }
      return ssh;
    };


    $('form[class="form-register"]').ajaxForm({
      beforeSubmit: function () {
        var email = $('#inputRegisterEmail'),
          pass = $('#inputRegisterPass'),
          repPass = $('#inputRegisterRepPass');

        var isEmailValidate = addValidate(email, {
          notNull: true,
          maxLength: 30,
          emailRegExp: /^\w+@shunshunliuxue.com$/
        });
        var isPassValidate = addValidate(pass, {
          notNull: true,
          maxLength: 15,
          minLength: 6
        });
        var isRepPassValidate = addValidate(repPass, {
          notNull: true,
          maxLength: 15,
          minLength: 6,
          equal: pass.val()
        });

        if (isEmailValidate && isPassValidate && isRepPassValidate) {
          return true;
        } else {
          tips.text('邮箱或密码错误，请重新输入！');
          return false;
        }
      },
      success: function (html) {
        console.debug(html);
        tips.html(html.msg);
      }
    });

    $('form[class="form-login"]').ajaxForm({
      beforeSubmit: function () {
        var email = $('#inputLoginEmail'),
          pass = $('#inputLoginPass');

        var isEmail = addValidate(email, {
          notNull: true,
          maxLength: 30,
          emailRegExp: /^\w+@shunshunliuxue.com$/
        });
        var isPass = addValidate(pass, {
          notNull: true,
          maxLength: 15,
          minLength: 6
        });
        if (isEmail && isPass) {
          return true;
        } else {
          tips.text('邮箱或密码错误，请重新输入！');
          return false;
        }
      },
      success: function (html) {
        console.debug(html);
        if (html.errcode) {
          tips.text(html.msg);
        } else {
          location.href = html.refer;
        }
      }
    });

    $('form[class="form-update"]').ajaxForm({
      beforeSubmit: function () {
        var oldPass = $('#inputUpOldPass'),
          newPass = $('#inputUpNewPass'),
          newRepPass = $('#inputUpRepPass');

        var isOldPass = addValidate(oldPass, {
          notNull: true,
          maxLength: 15,
          minLength: 6
        });
        var isNewPass = addValidate(newPass, {
          notNull: true,
          maxLength: 15,
          minLength: 6
        });
        var isRepPass = addValidate(newRepPass, {
          notNull: true,
          maxLength: 15,
          minLength: 6,
          equal: newPass.val()
        });
        if (isOldPass && isNewPass && isRepPass) {
          return true;
        } else {
          tips.text('密码错误，请重新输入！');
          return false;
        }
      },
      success: function (html) {
        console.debug(html);
        tips.text(html.msg);
      }
    });

    $('form[class="form-forgot"]').ajaxForm({
      beforeSubmit: function () {
        var email = $('#inputForgetEmail');

        var isEmailValidate = addValidate(email, {
          notNull: true,
          maxLength: 30,
          emailRegExp: /^\w+@shunshunliuxue.com$/
        });
        if (isEmailValidate) {
          return true;
        } else {
          tips.text('邮箱输入错误！');
          return false;
        }
      },
      success: function (html) {
        console.debug(html);
        tips.text(html.msg);
      }
    });

    $('form[class="form-reset"]').ajaxForm({
      beforeSubmit: function () {
        var pass = $('#inputRestPass');
        var isPassValidate = addValidate(pass, {
          notNull: true,
          maxLength: 15,
          minLength: 6
        });
        if (isPassValidate) {
          return true;
        } else {
          tips.text('密码格式错误！');
          return false;
        }
      },
      success: function (html) {
        console.debug(html);
        tips.text(html.msg);
      }
    });
  });
})(jQuery, hljs);
