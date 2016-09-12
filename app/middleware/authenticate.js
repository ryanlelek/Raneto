'use strict';

function middleware_authenticate(config) {
    if (config.authentication === true) {
        // Authentication Middleware
        return function(req, res, next) {
            if (!req.session.loggedIn) {
                if (config.googleoauth === true) {
                    res.redirect(403, '/login');
                } else {
                    res.redirect(403, '/login');
                }
                return;
            }
            return next();
        };

    } else {

        // No Authentication Required
        return function(req, res, next) {
            return next();
        };
    }
}

// Exports
module.exports = middleware_authenticate;