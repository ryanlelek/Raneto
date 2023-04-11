// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var express = require('express');

const fetch = import('node-fetch');

// [START setup]
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

function extractProfile(profile) {
  var imageUrl = '';
  var domain = '';
  var email = '';
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  if (profile.emails && profile.emails.length) {
    email = profile.emails[0].value;
  }
  if (profile._json && profile._json.domain) {
    domain = profile._json.domain;
  }
  return {
    id: profile.id,
    displayName: profile.displayName,
    image: imageUrl,
    email,
    domain,
  };
}

// [START middleware]
// Middleware that requires the user to be logged in. If the user is not logged
// in, it will redirect the user to authorize the application and then return
// them to the original URL they requested.
function authRequired(req, res, next) {
  if (!req.user) {
    req.session.oauth2return = req.originalUrl;
    return res.redirect('/login');
  }
  if (
    req.session.allowedDomain &&
    req.session.allowedDomain !== req.user.domain
  ) {
    return res.redirect('/login');
  }
  next();
}

// Middleware that exposes the user's profile as well as login/logout URLs to
// any templates. These are available as `profile`, `login`, and `logout`.
function addTemplateVariables(req, res, next) {
  res.locals.profile = req.user;
  res.locals.login = `/auth/login?return=${encodeURIComponent(
    req.originalUrl
  )}`;
  res.locals.logout = `/auth/logout?return=${encodeURIComponent(
    req.originalUrl
  )}`;
  next();
}
// [END middleware]

function router(config) {
  // Configure the Google strategy for use by Passport.js.
  //
  // OAuth 2-based strategies require a `verify` function which receives the
  // credential (`accessToken`) for accessing the Google API on the user's behalf,
  // along with the user's profile. The function must invoke `cb` with a user
  // object, which will be set at `req.user` in route handlers after
  // authentication.
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.oauth2.client_id,
        clientSecret: config.oauth2.client_secret,
        callbackURL: config.oauth2.callback,
        accessType: 'offline',
      },
      (accessToken, refreshToken, profile, cb) => {
        const parsedProfile = extractProfile(profile);
        if (config.google_group_restriction.enabled) {
          const groupName = config.google_group_restriction.group_name;
          const apiKey = config.google_group_restriction.api_key;
          const { email } = parsedProfile;
          fetch(
            `https://www.googleapis.com/admin/directory/v1/groups/${groupName}/hasMember/${email}?key=${apiKey}`,
            {
              method: 'get',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
            .then((res) => res.json())
            .then((res) => {
              if (res.isMember && res.isMember === true) {
                cb(null, parsedProfile);
              } else {
                cb(new Error('Unauthorized user'), null);
              }
            });
        } else {
          cb(null, parsedProfile);
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });
  // [END setup]

  var router = express.Router();

  var scopes = ['email', 'profile'];

  if (config.google_group_restriction.enabled) {
    scopes.push(
      'https://www.googleapis.com/auth/admin.directory.group.readonly',
      'https://www.googleapis.com/auth/admin.directory.user.readonly'
    );
  }

  // Begins the authorization flow. The user will be redirected to Google where
  // they can authorize the application to have access to their basic profile
  // information. Upon approval the user is redirected to `/auth/google/callback`.
  // If the `return` query parameter is specified when sending a user to this URL
  // then they will be redirected to that URL when the flow is finished.
  // [START authorize]
  router.get(
    // Login url
    '/auth/login',

    // Save the url of the user's current page so the app can redirect back to
    // it after authorization
    (req, res, next) => {
      if (req.query.return) {
        req.session.oauth2return = req.query.return;
      }
      next();
    },

    // Start OAuth 2 flow using Passport.js
    passport.authenticate('google', {
      scope: scopes,
      hostedDomain: config.oauth2.hostedDomain || '',
    })
  );
  // [END authorize]

  // [START callback]
  router.get(
    // OAuth 2 callback url. Use this url to configure your OAuth client in the
    // Google Developers console
    '/auth/google/callback',

    // Finish OAuth 2 flow using Passport.js
    passport.authenticate('google'),

    // Redirect back to the original page, if any
    (req, res) => {
      req.session.loggedIn = true;
      if (config.oauth2.validateHostedDomain) {
        req.session.allowedDomain = config.oauth2.hostedDomain;
      }
      var redirect = req.session.oauth2return || '/';
      delete req.session.oauth2return;
      res.redirect(redirect);
    }
  );
  // [END callback]

  // Deletes the user's credentials and profile from the session.
  // This does not revoke any active tokens.
  router.get('/auth/logout', (req, res) => {
    req.session.loggedIn = false;
    req.logout();
    res.redirect('/login');
  });

  return router;
}

module.exports = {
  extractProfile,
  router,
  required: authRequired,
  template: addTemplateVariables,
};
