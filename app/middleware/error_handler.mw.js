// Error-Handling Middleware
import getAuthContext from '../functions/get_auth_context.js';

function errorHandler(config) {
  return function (err, req, res, _next) {
    const status = err.status || 500;

    res.status(status);
    res.render('error', {
      config,
      status: err.status,
      message: config.lang.error[status] || 'An unexpected error occurred',
      error: {},
      body_class: 'page-error',
      lang: config.lang,
      ...getAuthContext(config, req.session),
    });
  };
}

// Exports
export default errorHandler;
