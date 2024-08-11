// Modules
import path from 'node:path';
import express from 'express';
import logger from 'morgan';
import cookie_parser from 'cookie-parser';
import body_parser from 'body-parser';
import moment from 'moment';
import helmet from 'helmet';
import hogan from 'hogan-express';
import session from 'express-session';
import passport from 'passport';
import language_load from './core/language.js';
import mw_authenticate from './middleware/authenticate.mw.js';
import mw_always_auth from './middleware/always_authenticate.mw.js';
import mw_auth_readonly from './middleware/authenticate_read_access.mw.js';
import mw_error_handler from './middleware/error_handler.mw.js';
import mw_oauth2 from './middleware/oauth2.mw.js';
import route_login from './routes/login.route.js';
import route_login_page from './routes/login_page.route.js';
import route_logout from './routes/logout.route.js';
import route_page_edit from './routes/page.edit.route.js';
import route_page_delete from './routes/page.delete.route.js';
import route_page_create from './routes/page.create.route.js';
import route_category_create from './routes/category.create.route.js';
import route_search from './routes/search.route.js';
import route_home from './routes/home.route.js';
import route_wildcard from './routes/wildcard.route.js';
import route_sitemap from './routes/sitemap.route.js';
const __dirname = import.meta.dirname;

function initialize(config) {
  // Load Translations
  if (!config.locale) {
    config.locale = 'en';
  }
  if (!config.lang) {
    config.lang = language_load(config.locale);
  }

  // Content_Dir requires trailing slash
  if (config.content_dir[config.content_dir.length - 1] !== path.sep) {
    config.content_dir += path.sep;
  }

  // Load Middleware
  const authenticate = mw_authenticate(config);
  const always_authenticate = mw_always_auth(config);
  const error_handler = mw_error_handler(config);

  // Load Multiple-Use Pages
  const route_search_init = route_search(config);
  const route_home_init = route_home(config);
  const route_wildcard_init = route_wildcard(config);
  const route_sitemap_init = route_sitemap(config);

  // New Express App
  const app = express();
  const router = express.Router();

  // Set IP Address and Port
  app.set('host', process.env.HOST || '127.0.0.1');
  app.set('port', process.env.PORT || 3000);

  // set locale as date and time format
  moment.locale(config.locale);

  // Setup Views
  if (!config.theme_dir) {
    config.theme_dir = path.join(__dirname, '..', 'themes');
  }
  if (!config.theme_name) {
    config.theme_name = 'default';
  }
  if (!config.public_dir) {
    config.public_dir = path.join(
      config.theme_dir,
      config.theme_name,
      'public',
    );
  }
  app.set('views', path.join(config.theme_dir, config.theme_name, 'templates'));
  app.set('layout', 'layout');
  app.set('view engine', 'html');
  app.enable('view cache');
  app.engine('html', hogan);

  // Setup Express
  app.use(logger('dev'));
  app.use(helmet({
    // TODO: Refine
    contentSecurityPolicy: false,
  }));
  app.use(body_parser.json());
  app.use(body_parser.urlencoded({ extended: false }));
  app.use(cookie_parser());
  app.use(express.static(config.public_dir));
  if (config.theme_dir !== path.join(__dirname, '..', 'themes')) {
    router.use(
      express.static(path.join(config.theme_dir, config.theme_name, 'public')),
    );
  }
  router.use(
    config.image_url,
    express.static(path.normalize(config.content_dir + config.image_url)),
  );
  router.use(
    '/translations',
    express.static(path.normalize(path.join(__dirname, 'translations'))),
  );

  // HTTP Authentication
  if (
    config.authentication === true ||
    config.authentication_for_edit ||
    config.authentication_for_read
  ) {
    app.use(
      session({
        secret: config.secret,
        name: 'raneto.sid',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(mw_auth_readonly(config));
    // OAuth2
    if (config.googleoauth === true) {
      app.use(passport.initialize());
      app.use(passport.session());
      router.use(mw_oauth2.router(config));
      app.use(mw_oauth2.template);
    }

    router.post('/rn-login', route_login(config));
    router.get('/logout', route_logout(config));
    router.get('/login', route_login_page(config));
  }

  // Online Editor Routes
  if (config.allow_editing === true) {
    let middlewareToUse = authenticate;
    if (config.authentication_for_edit === true) {
      middlewareToUse = always_authenticate;
    }
    if (config.googleoauth === true) {
      middlewareToUse = mw_oauth2.required;
    }

    router.post('/rn-edit', middlewareToUse, route_page_edit(config));
    router.post('/rn-delete', middlewareToUse, route_page_delete(config));
    router.post('/rn-add-page', middlewareToUse, route_page_create(config));
    router.post(
      '/rn-add-category',
      middlewareToUse,
      route_category_create(config),
    );
  }

  // Router for / and /index with or without search parameter
  if (config.googleoauth === true) {
    router.get(
      '/:var(index)?',
      mw_oauth2.required,
      route_search_init,
      route_home_init,
    );
    router.get(/^([^.]*)/, mw_oauth2.required, route_wildcard_init);
  } else if (config.authentication_for_read === true) {
    router.get('/sitemap.xml', authenticate, route_sitemap_init);
    router.get(
      '/:var(index)?',
      authenticate,
      route_search_init,
      route_home_init,
    );
    router.get(/^([^.]*)/, authenticate, route_wildcard_init);
  } else {
    router.get('/sitemap.xml', route_sitemap_init);
    router.get('/:var(index)?', route_search_init, route_home_init);
    router.get(/^([^.]*)/, route_wildcard_init);
  }

  // Handle Errors
  router.use(error_handler);
  app.use(config.prefix_url || '/', router);

  // Wrap App if base_url is set
  if (config.base_url !== '' && config.nowrap !== true) {
    const wrap_app = express();
    wrap_app.set('port', process.env.PORT || 3000);
    wrap_app.use(config.base_url, app);
    return wrap_app;
  } else {
    return app;
  }
}

// Exports
export default initialize;
