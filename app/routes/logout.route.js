function route_logout(config) {
  return function (req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.clearCookie(config.session_name);
      res.redirect(`${config.base_url}/`);
    });
  };
}

// Exports
export default route_logout;
