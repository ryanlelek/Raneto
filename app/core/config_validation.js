import fs from 'fs-extra';

const errors = [];

function require(field, message) {
  if (!field) {
    errors.push(message);
  }
}

function validateConfig(config) {
  errors.length = 0;

  // Secret
  if (!config.secret || config.secret === '' || config.secret.length < 16) {
    errors.push('config.secret must be at least 16 characters');
  }

  // Content directory
  require(config.content_dir, 'config.content_dir is required');
  if (config.content_dir && !fs.pathExistsSync(config.content_dir)) {
    errors.push(
      `config.content_dir "${config.content_dir}" does not exist or is not accessible`,
    );
  }

  // Image URL (used for static serving and filtering)
  require(config.image_url, 'config.image_url is required');

  // Base URL must be a string (can be empty)
  if (config.base_url === undefined || config.base_url === null) {
    errors.push('config.base_url is required (use empty string for root)');
  }

  // Credentials when authentication is enabled
  if (config.authentication === true && config.googleoauth !== true) {
    if (!Array.isArray(config.credentials) || config.credentials.length === 0) {
      errors.push(
        'config.credentials must be a non-empty array when authentication is enabled',
      );
    } else {
      config.credentials.forEach((cred, i) => {
        if (!cred.username || !cred.password) {
          errors.push(
            `config.credentials[${i}] must have username and password`,
          );
        }
      });
    }
  }

  // OAuth2 when enabled
  if (config.googleoauth === true) {
    if (!config.oauth2 || typeof config.oauth2 !== 'object') {
      errors.push(
        'config.oauth2 object is required when googleoauth is enabled',
      );
    } else {
      require(config.oauth2.client_id, 'config.oauth2.client_id is required');
      require(config.oauth2
        .client_secret, 'config.oauth2.client_secret is required');
      require(config.oauth2.callback, 'config.oauth2.callback is required');
    }

    // Google group restriction
    if (config.google_group_restriction?.enabled) {
      require(config.google_group_restriction
        .group_name, 'config.google_group_restriction.group_name is required when enabled');
      require(config.google_group_restriction
        .api_key, 'config.google_group_restriction.api_key is required when enabled');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Config validation failed:\n  - ${errors.join('\n  - ')}`);
  }
}

export default validateConfig;
