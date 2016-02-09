
'use strict';

function route_login_page (config) {
  return function (req, res, next) {

    return res.render('login', {
      layout : null,
      lang   : config.lang
    });

  };
}

// Exports
module.exports = route_login_page;
