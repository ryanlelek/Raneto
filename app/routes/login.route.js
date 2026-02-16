import { timingSafeEqual } from 'node:crypto';

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

function routeLogin(config) {
  return function (req, res) {
    const credential = config.credentials.find(
      (c) =>
        safeEqual(req.body.username, c.username) &&
        safeEqual(req.body.password, c.password),
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
export default routeLogin;
