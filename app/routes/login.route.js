function route_login(config) {
  return function (req, res) {
    const credential = config.credentials.find(
      (c) =>
        req.body.username === c.username && req.body.password === c.password,
    );

    if (credential) {
      req.session.loggedIn = true;
      req.session.username = credential.username;
      res.json({
        status: 1,
        message: config.lang.api.loginSuccessful,
      });
      return;
    }

    res.json({
      status: 0,
      message: config.lang.api.invalidCredentials,
    });
  };
}

// Exports
export default route_login;
