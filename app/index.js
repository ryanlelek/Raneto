// Modules
import path from 'node:path';
import express from 'express';
import logger from 'morgan';
import cookie_parser from 'cookie-parser';
import body_parser from 'body-parser';
import moment from 'moment';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mustacheExpress from 'mustache-express';
import session from 'express-session';
import FileStore from 'session-file-store';
import passport from 'passport';
import validateConfig from './core/config_validation.js';
import languageLoad from './core/language.js';
import authenticate from './middleware/authenticate.mw.js';
import authReadonly from './middleware/authenticate_read_access.mw.js';
import errorHandler from './middleware/error_handler.mw.js';
import oauth2 from './middleware/oauth2.mw.js';
import routeLogin from './routes/login.route.js';
import routeLoginPage from './routes/login_page.route.js';
import routeLogout from './routes/logout.route.js';
import routePageEdit from './routes/page.edit.route.js';
import routePageDelete from './routes/page.delete.route.js';
import routePageCreate from './routes/page.create.route.js';
import routeCategoryCreate from './routes/category.create.route.js';
import routeSearch from './routes/search.route.js';
import routeHome from './routes/home.route.js';
import routeWildcard from './routes/wildcard.route.js';
import routeSitemap from './routes/sitemap.route.js';
const __dirname = import.meta.dirname;

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 200;
const SESSION_TTL_SECONDS = 86400; // 24 hours
const SESSION_REAP_INTERVAL_SECONDS = 3600; // 1 hour
const COOKIE_MAX_AGE_MS = 86400000; // 24 hours

function initialize(config) {
  // Validate configuration
  validateConfig(config);

  // Load Translations
  if (!config.locale) {
    config.locale = 'en';
  }
  if (!config.lang) {
    config.lang = languageLoad(config.locale);
  }

  // Content_Dir requires trailing slash
  if (config.content_dir[config.content_dir.length - 1] !== path.sep) {
    config.content_dir += path.sep;
  }

  // Load Middleware
  const authMiddleware = authenticate(config);
  const alwaysAuthenticate = authenticate(config, { required: true });
  const handleError = errorHandler(config);

  // Load Multiple-Use Pages
  const searchInit = routeSearch(config);
  const homeInit = routeHome(config);
  const wildcardInit = routeWildcard(config);
  const sitemapInit = routeSitemap(config);

  // New Express App
  const app = express();
  const router = express.Router();

  // Set IP Address and Port
  app.set('host', process.env.HOST || '127.0.0.1');
  app.set('port', process.env.PORT || 8080);

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
  const viewsDir = path.join(config.theme_dir, config.theme_name, 'templates');
  app.set('views', viewsDir);
  app.set('view engine', 'html');
  app.enable('view cache');
  app.engine('html', mustacheExpress(path.join(viewsDir, 'partials'), '.html'));

  // Setup Express
  app.use(logger('dev'));

  // Rate limiting - 200 requests per minute per IP
  app.use(
    rateLimit({
      windowMs: RATE_LIMIT_WINDOW_MS,
      max: RATE_LIMIT_MAX_REQUESTS,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );
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
    express.static(path.join(config.content_dir, config.image_url)),
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
    const SessionFileStore = FileStore(session);
    app.use(
      session({
        store: new SessionFileStore({
          path: './sessions',
          ttl: SESSION_TTL_SECONDS,
          retries: 0,
          reapInterval: SESSION_REAP_INTERVAL_SECONDS,
        }),
        secret: config.secret,
        name: 'raneto.sid',
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: COOKIE_MAX_AGE_MS,
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          sameSite: 'Lax',
        },
      }),
    );
    app.use(authReadonly(config));
    // OAuth2
    if (config.googleoauth === true) {
      app.use(passport.initialize());
      app.use(passport.session());
      router.use(oauth2.router(config));
      app.use(oauth2.template);
    }

    router.post('/rn-login', routeLogin(config));
    router.get('/logout', routeLogout(config));
    router.get('/login', routeLoginPage(config));
  }

  // Online Editor Routes
  if (config.allow_editing === true) {
    let middlewareToUse = authMiddleware;
    if (config.authentication_for_edit === true) {
      middlewareToUse = alwaysAuthenticate;
    }
    if (config.googleoauth === true) {
      middlewareToUse = oauth2.required;
    }

    router.post('/rn-edit', middlewareToUse, routePageEdit(config));
    router.post('/rn-delete', middlewareToUse, routePageDelete(config));
    router.post('/rn-add-page', middlewareToUse, routePageCreate(config));
    router.post(
      '/rn-add-category',
      middlewareToUse,
      routeCategoryCreate(config),
    );
  }

  // Select read-access middleware based on auth config
  let readMiddleware = (req, res, next) => next();
  if (config.googleoauth) {
    readMiddleware = oauth2.required;
  } else if (config.authentication_for_read) {
    readMiddleware = authMiddleware;
  }

  router.get('/sitemap.xml', readMiddleware, sitemapInit);
  router.get('/', readMiddleware, searchInit, homeInit);
  router.get(/^([^.]*)/, readMiddleware, wildcardInit);

  // Handle Errors
  router.use(handleError);
  app.use(config.prefix_url || '/', router);

  // Wrap App if base_url is set
  if (config.base_url !== '' && config.nowrap !== true) {
    const wrapApp = express();
    wrapApp.set('port', process.env.PORT || 8080);
    wrapApp.use(config.base_url, app);
    return wrapApp;
  } else {
    return app;
  }
}

// Exports
export default initialize;
