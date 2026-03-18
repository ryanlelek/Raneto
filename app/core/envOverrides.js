// Environment variable overrides
// Priority order: defaults < config file < environment variables
//
// Boolean env vars: set to the string "true" or "false"
// Number env vars: set to a numeric string
// String env vars: set to any string value

const BOOLEAN_KEYS = new Set([
  'allow_editing',
  'authentication',
  'authentication_for_edit',
  'authentication_for_read',
  'googleoauth',
  'csp_nonce',
  'rtl_layout',
  'table_of_contents',
  'nowrap',
  'category_sort',
  'show_on_home_default',
  'show_on_menu_default',
  'menu_on_pages',
  'menu_on_page_collapsible',
]);

const NUMBER_KEYS = new Set(['excerpt_length']);

// Maps environment variable names to config keys.
const ENV_MAP = {
  SESSION_SECRET: 'session_secret',
  CONTENT_DIR: 'content_dir',
  BASE_URL: 'base_url',
  SITE_TITLE: 'site_title',
  GOOGLE_ANALYTICS_ID: 'google_analytics_id',
  LOCALE: 'locale',
  AUTHENTICATION: 'authentication',
  ALLOW_EDITING: 'allow_editing',
};

function applyEnvOverrides(config, env = process.env) {
  for (const [envKey, configKey] of Object.entries(ENV_MAP)) {
    const value = env[envKey];
    if (value === undefined) {
      continue;
    }

    if (BOOLEAN_KEYS.has(configKey)) {
      config[configKey] = value === 'true';
    } else if (NUMBER_KEYS.has(configKey)) {
      const num = Number(value);
      if (!Number.isNaN(num)) {
        config[configKey] = num;
      }
    } else {
      config[configKey] = value;
    }
  }

  // ADMIN_USERNAME and ADMIN_PASSWORD must be provided together
  const adminUsername = env.ADMIN_USERNAME;
  const adminPassword = env.ADMIN_PASSWORD;

  if (adminUsername && !adminPassword) {
    throw new Error(
      'ADMIN_USERNAME is set but ADMIN_PASSWORD is missing — provide both or neither',
    );
  }
  if (adminPassword && !adminUsername) {
    throw new Error(
      'ADMIN_PASSWORD is set but ADMIN_USERNAME is missing — provide both or neither',
    );
  }
  if (adminUsername && adminPassword) {
    if (!Array.isArray(config.credentials)) {
      config.credentials = [];
    }
    config.credentials.unshift({
      username: adminUsername,
      password: adminPassword,
    });
  }

  return config;
}

export default applyEnvOverrides;
