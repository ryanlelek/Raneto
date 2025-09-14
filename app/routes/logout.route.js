function route_logout(config) {
  return function (req, res) {
    req.session.loggedIn = false;
    req.session.username = null;
    res.redirect(`${config.base_url}/`);
  };
}

// Exports
export default route_logout;
