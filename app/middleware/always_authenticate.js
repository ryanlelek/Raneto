
'use strict';

function middleware_authenticate (config) {

  return function (req, res, next) {
    if (!req.session.loggedIn) {
      res.redirect(403, '/login');
      return;
    }
    return next();
  };

}

// Exports
module.exports = middleware_authenticate;
