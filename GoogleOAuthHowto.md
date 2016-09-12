# Raneto Google OAuth login

## TL;DR
[Raneto](http://raneto.com/) allows only basic username/password authentication, so I added Google OAuth support. This option can be turned on by setting the `googleoauth` option in the `config.default.js` file to `true`, and by supplying the OAuth config object as outlined in the guides below. Additionally, you can allow only emails from the certain domain to use the service with one config setting.

The basic idea was taken from the [Google Cloud Platform Node.js guide](https://github.com/GoogleCloudPlatform/nodejs-getting-started/tree/master/4-auth).

This has been submitted as a [pull request]() on the official Raneto Github repository. This is my way of saying thanks to an awesome author of Raneto.

## Steps on how to reproduce this on fresh copy
Below are the steps one needs to take to get this working on a fresh copy of Raneto. In case this won't make it to the official repo, you can clone my fork [here](https://github.com/Hitman666/Raneto). Just make sure you set your Google OAuth credentials properly (more about this in the **X** section).

### Install packages via npm
_Make sure you first [install Raneto dependencies](http://docs.raneto.com/install/installing-raneto) after you clone it._

Install the following packages:

+ `npm install passport --save-dev`
+ `npm install passport-google-oauth20 --save-dev`

### Editing the `app/index.js` file

+ Add passport: `var passport=require('passport');` just after raneto is required.
+ Add oauth2 middleware: `var oauth2= require('./middleware/oauth2.js');` in the config block, just afer `error_handler.js` middleware.
+ Change `secret` to `secret:config.secret,` in the `// HTTP Authentication` section.
+ >>> Remove the rn-login route `app.post('/rn-login', route_login);`
+ >>> Remove the logout route: `app.get('/logout', route_logout);`
+ Add the following Oauth settings, just before the `app.post('/rn-login', route_login);` line:

```
// OAuth2
if (config.googleoauth === true) {
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(oauth2.router(config));
  app.use(oauth2.template);
}
```

+ Change the `Online Editor Routes` to look like this now:

```
// Online Editor Routes
if (config.allow_editing === true) {
  if (config.googleoauth === true) {
    app.post('/rn-edit',         oauth2.required, route_page_edit);
    app.post('/rn-delete',       oauth2.required, route_page_delete);
    app.post('/rn-add-page',     oauth2.required, route_page_create);
    app.post('/rn-add-category', oauth2.required, route_category_create);
  }
  else {
    app.post('/rn-edit',         authenticate, route_page_edit);
    app.post('/rn-delete',       authenticate, route_page_delete);
    app.post('/rn-add-page',     authenticate, route_page_create);
    app.post('/rn-add-category', authenticate, route_category_create);
  }
}
```

+ Set the root routes to be like this:

```
// Router for / and /index with or without search parameter
if (config.googleoauth === true) {
  app.get('/:var(index)?', oauth2.required, route_search, route_home);
  app.get(/^([^.]*)/, oauth2.required, route_wildcard);
}
else {
  app.get('/:var(index)?', route_search, route_home);
  app.get(/^([^.]*)/, route_wildcard);
}
```

### Editing the `app/middleware/authenticate.js` file
Change the `res.redirect(403, '/login');` line to be:

```
if (config.googleoauth === true) {
  res.redirect('/login');
}
else {
  res.redirect(403, '/login');  
}
```

### Editing the `app/routes/login_page.route.js` file
Add the `googleoauth` variable to the return object like this:

```
return res.render('login', {
  layout      : null,
  lang        : config.lang,
  rtl_layout  : config.rtl_layout,
  googleoauth : config.googleoauth
});
```

### Add the oauth2.js file
Create a new file `oauth2.js` in the `app/middleware` folder with the following content:

```
// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var express = require('express');
var debug = require('debug')('raneto');

// [START setup]
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

function extractProfile (profile) {
  var imageUrl = '';
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  return {
    id: profile.id,
    displayName: profile.displayName,
    image: imageUrl
  };
}

// [START middleware]
// Middleware that requires the user to be logged in. If the user is not logged
// in, it will redirect the user to authorize the application and then return
// them to the original URL they requested.
function authRequired (req, res, next) {
  if (!req.user) {
    req.session.oauth2return = req.originalUrl;
    return res.redirect('/login');
  }
  next();
}

// Middleware that exposes the user's profile as well as login/logout URLs to
// any templates. These are available as `profile`, `login`, and `logout`.
function addTemplateVariables (req, res, next) {
  res.locals.profile = req.user;
  res.locals.login = '/auth/login?return=' +
    encodeURIComponent(req.originalUrl);
  res.locals.logout = '/auth/logout?return=' +
    encodeURIComponent(req.originalUrl);
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
  passport.use(new GoogleStrategy({
    clientID: config.oauth2.client_id,
    clientSecret: config.oauth2.client_secret,
    callbackURL: config.oauth2.callback,
    hostedDomain: config.hostedDomain || '',
    accessType: 'offline',

  }, function (accessToken, refreshToken, profile, cb) {
    // Extract the minimal profile information we need from the profile object
    // provided by Google
    cb(null, extractProfile(profile));
  }));

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
  // [END setup]

  var router = express.Router();

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
    function (req, res, next) {
      if (req.query.return) {
        req.session.oauth2return = req.query.return;
      }
      next();
    },

    // Start OAuth 2 flow using Passport.js
    passport.authenticate('google', { scope: ['email', 'profile'] })
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
    function (req, res) {
      req.session.loggedIn = true;
      var redirect = req.session.oauth2return || '/';
      delete req.session.oauth2return;
      res.redirect(redirect);
    }
  );
  // [END callback]

  // Deletes the user's credentials and profile from the session.
  // This does not revoke any active tokens.
  router.get('/auth/logout', function (req, res) {
    req.session.loggedIn = false;
    req.logout();
    res.redirect('/login');
  });


  return router;
}

module.exports = {
  extractProfile: extractProfile,
  router: router,
  required: authRequired,
  template: addTemplateVariables
};
```

This is a changed file based on the [Google Node.js official example](https://raw.githubusercontent.com/GoogleCloudPlatform/nodejs-getting-started/master/4-auth/lib/oauth2.js) file. Notable differences are in Google strategy settings which basically load settings from our settings config: 

```
clientID: config.oauth2.client_id,
clientSecret: config.oauth2.client_secret,
callbackURL: config.oauth2.callback,
hostedDomain: config.hostedDomain || '',
```

We'll define these settings the `config.default.js` file now.

### Editing the `example/config.default.js` file
Change/add the following settings:

```
allow_editing : true,
authentication : true,
googleoauth: true,
oauth2 : {
    client_id: 'GOOGLE_CLIENT_ID',
    client_secret: 'GOOGLE_CLIENT_SECRET',
    callback: 'http://localhost:3000/auth/google/callback',
    hostedDomain: 'google.com'
},
secret: 'someCoolSecretRightHere',
```

### Google OAuth2 Credentials
Oauth2 settings (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET `) can be found in your `Google Cloud Console->API Manager->Credentials` project settings (create a project if you don't have one yet):

![](http://i.imgur.com/TdkYKul.png)

The `callback`, if testing locally, can be set as shown above (`http://localhost:3000/auth/google/callback`). The `hostedDomain` option allows certain domains - for your use case you may want to set this to your domain.

#### Google+ API
If you get an error like:

> Access Not Configured. Google+ API has not been used in project 701766813496 before, or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/plus/overview?project=701766813496 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.

Make sure you enable Google+ API for your project:

![](http://i.imgur.com/GcymtaZ.png)

### Adding Zocial CSS
To add support for the nice [Zocial social buttons](http://zocial.smcllns.com/), download [this file](https://github.com/smcllns/css-social-buttons/blob/master/css/zocial.css) from their Github repo to the `themes/default/public/styles/` folder.

### Editing the `themes/default/templates/layout.html` file
Replace the login form with:

```
{{^config.googleoauth}}
<form class="form-inline pull-right">
  {{#config.authentication}}
    {{#loggedIn}}
      <div class="dropdown">
        <button class="btn btn-info dropdown-toggle" type="button" id="userDropDown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          {{username}}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropDown">
          <li><a href="{{config.base_url}}/logout" class="btn btn-info">{{lang.login.logout}}</a></li>
        </ul>
      </div>
    {{/loggedIn}}
    {{^loggedIn}}
    &nbsp;<a href="{{config.base_url}}/login" class="btn btn-info">{{lang.login.login}}</a>
    {{/loggedIn}}
  {{/config.authentication}}
</form>
{{/config.googleoauth}}

{{#config.googleoauth}}
<form class="form-inline pull-right">
  {{#config.authentication}} {{#loggedIn}} &nbsp;
  <span>{{profile.displayName}}</span> &nbsp;
  <a href="{{config.base_url}}/auth/logout" class="btn btn-info">{{lang.login.logout}}</a> {{/loggedIn}} {{^loggedIn}} &nbsp;
  <a href="{{config.base_url}}/auth/login" class="btn btn-info">{{lang.login.login}}</a> {{/loggedIn}} {{/config.authentication}}
</form>
{{/config.googleoauth}}
```

We added two scenarios for when we have Google OAuth enabled (`config.googleoauth`) and when we don't (defaulting to the current Raneto behavior).

### Editing the `themes/default/templates/login.html` file
Add zocial reference:

`<link rel="stylesheet" href="{{config.base_url}}/styles/zocial.css">`

Replace the whole `form-bottom` classed div with the following code:

```
<div class="form-bottom">
    {{#config.googleoauth}}
      <a href="/auth/login" class="zocial google">Sign in with Google</a>
    {{/config.googleoauth}}

    {{^config.googleoauth}}
    <form role="form" action="" method="post" class="login-form">
      <div class="form-group">
        <label class="sr-only" for="form-username">{{lang.login.username}}</label>
          <input tabindex="1" type="text" name="username" placeholder="{{lang.login.username}}" class="form-username form-control" id="form-username">
        </div>
        <div class="form-group">
          <label class="sr-only" for="form-password">{{lang.login.password}}</label>
          <input tabindex="2" type="password" name="password" placeholder="{{lang.login.password}}" class="form-password form-control" id="form-password">
        </div>
        <button type="submit" class="btn">{{lang.login.login}}</button>
    </form>
    {{/config.googleoauth}}
</div>
```

Same thing here as well. If we have Google OAuth enabled (`config.googleoauth`) then we show the new Google login button and hide the rest. Otherwise, we default it to the current Raneto behavior.

## Testing
Congratulations, you're done! Now, to test this locally just run the `npm start` from the root of your project and go to `http://localhost:3000` and you should see this:

![](http://i.imgur.com/qTTwY4z.png)

After logging in, you should see something like this:

![](http://i.imgur.com/1YcdTou.png)

Hope this helps someone!