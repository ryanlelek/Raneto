
'use strict';

// Error-Handling Middleware
function handler (config) {
  return function (err, req, res, next) {

    var status = err.status || 500;

    res.status(status);
    res.render('error', {
      config     : config,
      status     : err.status,
      message    : config.lang.error[status] || err.message,
      error      : {},
      body_class : 'page-error',
      loggedIn   : ((config.authentication || config.authentication_for_edit) ? req.session.loggedIn : false)
    });

  };
}

// Exports
module.exports = handler;
