function middleware_authenticate(config) {
  return function (req, res, next) {
    if (!req.session.loggedIn) {
      res.redirect(403, `${config.base_url}/login`);
      return;
    }
    return next();
  };
}

// Exports
export default middleware_authenticate;
