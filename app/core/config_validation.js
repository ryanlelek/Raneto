function validateConfig(config) {
  if (!config.secret || config.secret === '' || config.secret.length < 16) {
    throw new Error('Config secret needs a value at least 16 characters');
  }
}

export default validateConfig;
