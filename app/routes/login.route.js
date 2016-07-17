
'use strict';

function route_login (config) {
  return function (req, res, next) {

    for (var i = 0; i < config.credentials.length; i++) {
      if (
        req.param('username') === config.credentials[i].username &&
        req.param('password') === config.credentials[i].password
      ) {
        req.session.loggedIn = true;
        req.session.username = config.credentials[i].username;
        res.json({
          status  : 1,
          message : config.lang.api.loginSuccessful
        });
        return;
      }
    }

    res.json({
      status  : 0,
      message : config.lang.api.invalidCredentials
    });
  };
}

// Exports
module.exports = route_login;
