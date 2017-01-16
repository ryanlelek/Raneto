'use strict';

function middleware_authenticate_read_access (config) {

  if (config.authentication === true && config.authentication_for_edit === false) {
    return function (req, res, next) {
      if (!req.session.loggedIn) {
        if (req.path === '/rn-login' ||
            req.path === '/logout'   ||
            req.path === '/login') {
          return next();
        } else {
          res.redirect(403, '/login');
          return;
        }
        return next();
      } else {
        return next();
      }
    };
  } else {
    // No Authentication Required
    return function (req, res, next) {
      return next();
    };
  }
}

// Exports
module.exports = middleware_authenticate_read_access;
