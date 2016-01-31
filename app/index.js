
'use strict';

// Modules
var express       = require('express');
var path          = require('path');
var fs            = require('fs');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookie_parser = require('cookie-parser');
var body_parser   = require('body-parser');
var _s            = require('underscore.string');
var moment        = require('moment');
var marked        = require('marked');
var validator     = require('validator');
var extend        = require('extend');
var hogan         = require('hogan-express');
var session       = require('express-session');
var sanitize      = require('sanitize-filename');
var raneto        = require('raneto-core');

function initialize (config) {

  // New Express App
  var app = express();
  
  // empty authorization middleware in case we don't need authentication at all
  var isAuthenticated = function(req, res, next) {
        return next();
      };

  // Setup Port
  app.set('port', process.env.PORT || 3000);

  // set locale as date and time format
  moment.locale(config.locale);

  // Setup Views
  if (!config.theme_dir)  { config.theme_dir  = path.join(__dirname, '..', 'themes'); }
  if (!config.theme_name) { config.theme_name = 'default'; }
  app.set('views', path.join(config.theme_dir, config.theme_name, 'templates'));
  app.set('layout', 'layout');
  app.set('view engine', 'html');
  app.enable('view cache');
  app.engine('html', hogan);

  // Setup Express
  app.use(favicon(config.public_dir + '/favicon.ico'));
  app.use(logger('dev'));
  app.use(body_parser.json());
  app.use(body_parser.urlencoded({ extended : false }));
  app.use(cookie_parser());
  app.use(express.static(config.public_dir));

  // Setup config
  extend(raneto.config, config);

  // HTTP Authentication
  if (config.authentication === true) {
    app.use(session(
      {
        secret: "changeme",
        name: "raneto.sid",
        resave: false,
        saveUninitialized: false
      }
    ));

    app.post('/rn-login', function (req, res, next) {
      if(req.param('username') === config.credentials.username
        && req.param('password') === config.credentials.password)
      {
        req.session.loggedIn = true;
        res.json({
          status  : 1,
          message : config.lang.api.loginSuccessful
        });
      } else {
        res.json({
          status  : 0,
          message : config.lang.api.invalidCredentials
        });
      }
    });

    app.get("/login", function(req, res, next){
      return res.render('login', {
        layout : null,
        lang   : config.lang
      });
    });
    app.get("/logout", function(req, res, next){
      req.session.loggedIn = false;
      res.redirect("/login");
    });
    
    // Authentication Middleware
    isAuthenticated = function(req, res, next) {
      if (! req.session.loggedIn) {
        res.redirect(403, "/login");

        return;
      }

      return next();
    }
  }

  // Online Editor Routes
  if (config.allow_editing === true) {

    app.post('/rn-edit', isAuthenticated, function (req, res, next) {
      var req_file     = req.body.file.split('/');
      var fileCategory = '';
      var fileName     = '/' + sanitize(req_file[1]);
      if (req_file.length > 2) {
        fileCategory   = '/' + sanitize(req_file[1]);
        fileName       = '/' + sanitize(req_file[2]);
      }
      var filePath     = path.normalize(raneto.config.content_dir + fileCategory + fileName);
      if (!fs.existsSync(filePath)) { filePath += '.md'; }
      fs.writeFile(filePath, req.body.content, function (err) {
        if (err) {
          console.log(err);
          return res.json({
            status  : 1,
            message : err
          });
        }
        res.json({
          status  : 0,
          message : config.lang.api.pageSaved
        });
      });
    });

    app.post('/rn-delete', isAuthenticated, function (req, res, next) {
      var req_file     = req.body.file.split('/');
      var fileCategory = '';
      var fileName     = '/' + sanitize(req_file[1]);
      if (req_file.length > 2) {
        fileCategory   = '/' + sanitize(req_file[1]);
        fileName       = '/' + sanitize(req_file[2]);
      }
      var filePath     = path.normalize(raneto.config.content_dir + fileCategory + fileName);
      if (!fs.existsSync(filePath)) { filePath += '.md'; }
      fs.rename(filePath, filePath + '.del', function (err) {
        if (err) {
          console.log(err);
          return res.json({
            status: 1,
            message: err
          });
        }
        res.json({
          status: 0,
          message: config.lang.api.pageDeleted
        });
      });
    });

    app.post('/rn-add-category', isAuthenticated, function (req, res, next) {
      var fileCategory = '/' + sanitize(req.body.category);
      var filePath     = path.normalize(raneto.config.content_dir + fileCategory);
      fs.mkdir(filePath, function (err) {
        if (err) {
          console.log(err);
          return res.json({
            status  : 1,
            message : err
          });
        }
        res.json({
          status  : 0,
          message : config.lang.api.categoryCreated
        });
      });
    });

    app.post('/rn-add-page', isAuthenticated, function (req, res, next) {
      var fileCategory = '';
      if (req.body.category) {
        fileCategory   = '/' + sanitize(req.body.category);
      }
      var fileName     = '/' + sanitize(req.body.name + '.md');
      var filePath     = path.normalize(raneto.config.content_dir + fileCategory + fileName);
      fs.open(filePath, 'a', function (err, fd) {
        fs.close(fd);
        if (err) {
          console.log(err);
          return res.json({
            status  : 1,
            message : err
          });
        }
        res.json({
          status  : 0,
          message : config.lang.api.pageCreated
        });
      });
    });

  }

  // Router for / and /index with or without search parameter
  app.get("/:var(index)?", function(req, res, next){
    if (req.query.search) {

      var searchQuery    = validator.toString(validator.escape(_s.stripTags(req.query.search))).trim();
      var searchResults  = raneto.doSearch(searchQuery);
      var pageListSearch = raneto.getPages('');

      return res.render('search', {
        config: config,
        pages: pageListSearch,
        search: searchQuery,
        searchResults: searchResults,
        body_class: 'page-search',
        lang: config.lang,
        loggedIn: (config.authentication ? req.session.loggedIn : false)
      });

    } else {
      var suffix = 'edit';
      var slug = req.params[0];
      if (slug === '/') { slug = '/index'; }

      var pageList     = raneto.getPages(slug);
      var filePath     = path.normalize(raneto.config.content_dir + slug);
      var filePathOrig = filePath;

      if (filePath.indexOf(suffix, filePath.length - suffix.length) !== -1) {
        filePath = filePath.slice(0, - suffix.length - 1);
      }
      var stat = fs.lstatSync(path.join(config.theme_dir, config.theme_name, 'templates', 'home.html'));

      return res.render('home', {
        config        : config,
        pages         : pageList,
        body_class    : 'page-home',
        last_modified : moment(stat.mtime).format('Do MMM YYYY'),
        lang          : config.lang,
        loggedIn: (config.authentication ? req.session.loggedIn : false)
      });
    }
  });

  app.get(/^([^.]*)/, function (req, res, next) {
    var suffix = 'edit';

     if (req.params[0]) {

      var slug = req.params[0];

      var pageList     = raneto.getPages(slug);
      var filePath     = path.normalize(raneto.config.content_dir + slug);
      var filePathOrig = filePath;

      if (filePath.indexOf(suffix, filePath.length - suffix.length) !== -1) {
        filePath = filePath.slice(0, - suffix.length - 1);
      }
      if (!fs.existsSync(filePath)) { filePath += '.md'; }

      if (filePathOrig.indexOf(suffix, filePathOrig.length - suffix.length) !== -1) {

        fs.readFile(filePath, 'utf8', function (err, content) {
          if (config.authentication === true && ! req.session.loggedIn) {
            res.redirect("/login");
            return;
          }

          if (err) {
            err.status = '404';
            err.message = config.lang.error['404'];
            return next(err);
          }

          if (path.extname(filePath) === '.md') {

            // File info
            var stat = fs.lstatSync(filePath);
            // Meta
            var meta = raneto.processMeta(content);
            content = raneto.stripMeta(content);
            if (!meta.title) { meta.title = raneto.slugToTitle(filePath); }

            // Content
            content      = raneto.processVars(content);
            var html     = content;
            var template = meta.template || 'page';

            return res.render('edit', {
              config: config,
              pages: pageList,
              meta: meta,
              content: html,
              body_class: template + '-' + raneto.cleanString(slug),
              last_modified: moment(stat.mtime).format('Do MMM YYYY'),
              lang: config.lang,
              loggedIn: (config.authentication ? req.session.loggedIn : false)
            });

          }
        });

      } else {

        fs.readFile(filePath, 'utf8', function (err, content) {

          if (err) {
            err.status = '404';
            err.message = config.lang.error['404'];
            return next(err);
          }

          // Process Markdown files
          if (path.extname(filePath) === '.md') {

            // File info
            var stat = fs.lstatSync(filePath);

            // Meta
            var meta = raneto.processMeta(content);
            content = raneto.stripMeta(content);
            if (!meta.title) { meta.title = raneto.slugToTitle(filePath); }

            // Content
            content = raneto.processVars(content);
            // BEGIN: DISPLAY, NOT EDIT
            marked.setOptions({
              langPrefix: ''
            });
            var html = marked(content);
            // END: DISPLAY, NOT EDIT
            var template = meta.template || 'page';

            return res.render(template, {
              config: config,
              pages: pageList,
              meta: meta,
              content: html,
              body_class: template + '-' + raneto.cleanString(slug),
              last_modified: moment(stat.mtime).format('Do MMM YYYY'),
              lang: config.lang,
              loggedIn: (config.authentication ? req.session.loggedIn : false)
            });

          }
        });
      }
    } else {
      next();
    }
  });

  // Error-Handling Middleware
  app.use(function (err, req, res, next) {
    var status = err.status || 500;

    res.status(status);
    res.render('error', {
      config     : config,
      status     : err.status,
      message    : config.lang.error[status] || err.message,
      error      : {},
      body_class : 'page-error',
      loggedIn   : (config.authentication ? req.session.loggedIn : false)
    });
  });

  return app;

}

// Exports
module.exports = initialize;
