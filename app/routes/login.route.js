function route_login(config) {
  return function (req, res) {
    for (let i = 0; i < config.credentials.length; i++) {
      if (
        req.body.username === config.credentials[i].username &&
        req.body.password === config.credentials[i].password
      ) {
        req.session.loggedIn = true;
        req.session.username = config.credentials[i].username;
        res.json({
          status: 1,
          message: config.lang.api.loginSuccessful,
        });
        return;
      }
    }

    res.json({
      status: 0,
      message: config.lang.api.invalidCredentials,
    });
  };
}

// Exports
export default route_login;
