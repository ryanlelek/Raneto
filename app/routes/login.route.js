
'use strict';

function route_login (config) {
  return function (req, res, next) {

    if (
      req.param('username') === config.credentials.username &&
      req.param('password') === config.credentials.password
    ) {
      req.session.loggedIn = true;
      res.json({
        status  : 1,
        message : config.lang.api.loginSuccessful
      });
    } else {
      res.json({
        status  : 0,
        message : config.lang.api.invalidCredentials
      });
    }

  };
}

// Exports
module.exports = route_login;
