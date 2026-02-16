function middlewareAuthenticate(config, { required = false } = {}) {
  if (required || config.authentication === true) {
    return function (req, res, next) {
      if (!req.session.loggedIn) {
        res.redirect(302, `${config.base_url}/login`);
        return;
      }
      return next();
    };
  }

  // No Authentication Required
  return function (req, res, next) {
    return next();
  };
}

// Exports
export default middlewareAuthenticate;
