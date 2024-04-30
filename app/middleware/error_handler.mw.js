// Error-Handling Middleware
function mw_error_handler(config) {
  return function (err, req, res) {
    const status = err.status || 500;

    res.status(status);
    res.render('error', {
      config,
      status: err.status,
      message: config.lang.error[status] || err.message,
      error: {},
      body_class: 'page-error',
      loggedIn:
        config.authentication || config.authentication_for_edit
          ? req.session.loggedIn
          : false,
    });
  };
}

// Exports
export default mw_error_handler;
