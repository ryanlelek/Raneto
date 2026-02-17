import path from 'node:path';
import validateConfig from '../app/core/configValidation.js';
import languageLoad from '../app/core/language.js';

const validBase = {
  secret: 'a-valid-secret-1234',
  content_dir: path.join(import.meta.dirname, '..', 'content'),
  image_url: '/images',
  base_url: '',
};

describe('#validateConfig()', () => {
  // Secret

  it('throws when secret is missing', () => {
    expect(() => validateConfig({})).toThrow('config.secret');
  });

  it('throws when secret is empty string', () => {
    expect(() => validateConfig({ ...validBase, secret: '' })).toThrow(
      'config.secret',
    );
  });

  it('throws when secret is too short', () => {
    expect(() => validateConfig({ ...validBase, secret: 'short' })).toThrow(
      'config.secret',
    );
  });

  it('does not throw for valid config', () => {
    expect(() => validateConfig({ ...validBase })).not.toThrow();
  });

  // Content directory

  it('throws when content_dir is missing', () => {
    expect(() =>
      validateConfig({ ...validBase, content_dir: undefined }),
    ).toThrow('config.content_dir is required');
  });

  it('throws when content_dir does not exist', () => {
    expect(() =>
      validateConfig({ ...validBase, content_dir: '/nonexistent/path' }),
    ).toThrow('does not exist');
  });

  // Image URL

  it('throws when image_url is missing', () => {
    expect(() =>
      validateConfig({ ...validBase, image_url: undefined }),
    ).toThrow('config.image_url');
  });

  // Base URL

  it('throws when base_url is undefined', () => {
    expect(() => validateConfig({ ...validBase, base_url: undefined })).toThrow(
      'config.base_url',
    );
  });

  it('allows empty string base_url', () => {
    expect(() => validateConfig({ ...validBase, base_url: '' })).not.toThrow();
  });

  // Credentials

  it('throws when authentication enabled without credentials', () => {
    expect(() =>
      validateConfig({ ...validBase, authentication: true }),
    ).toThrow('config.credentials');
  });

  it('throws when credentials array is empty', () => {
    expect(() =>
      validateConfig({
        ...validBase,
        authentication: true,
        credentials: [],
      }),
    ).toThrow('config.credentials');
  });

  it('throws when credential is missing username', () => {
    expect(() =>
      validateConfig({
        ...validBase,
        authentication: true,
        credentials: [{ password: 'pass' }],
      }),
    ).toThrow('credentials[0] must have username and password');
  });

  it('throws when credential is missing password', () => {
    expect(() =>
      validateConfig({
        ...validBase,
        authentication: true,
        credentials: [{ username: 'user' }],
      }),
    ).toThrow('credentials[0] must have username and password');
  });

  it('does not throw for valid credentials', () => {
    expect(() =>
      validateConfig({
        ...validBase,
        authentication: true,
        credentials: [{ username: 'admin', password: 'password123' }],
      }),
    ).not.toThrow();
  });

  it('skips credential validation when googleoauth is enabled', () => {
    expect(() =>
      validateConfig({
        ...validBase,
        authentication: true,
        googleoauth: true,
        oauth2: {
          client_id: 'id',
          client_secret: 'secret',
          callback: 'http://localhost/callback',
        },
      }),
    ).not.toThrow();
  });

  // OAuth2

  it('throws when googleoauth enabled without oauth2 config', () => {
    expect(() => validateConfig({ ...validBase, googleoauth: true })).toThrow(
      'config.oauth2 object is required',
    );
  });

  it('throws when oauth2 is missing client_id', () => {
    expect(() =>
      validateConfig({
        ...validBase,
        googleoauth: true,
        oauth2: { client_secret: 's', callback: 'c' },
      }),
    ).toThrow('config.oauth2.client_id');
  });

  it('throws when oauth2 is missing client_secret', () => {
    expect(() =>
      validateConfig({
        ...validBase,
        googleoauth: true,
        oauth2: { client_id: 'i', callback: 'c' },
      }),
    ).toThrow('config.oauth2.client_secret');
  });

  it('throws when oauth2 is missing callback', () => {
    expect(() =>
      validateConfig({
        ...validBase,
        googleoauth: true,
        oauth2: { client_id: 'i', client_secret: 's' },
      }),
    ).toThrow('config.oauth2.callback');
  });

  // Google group restriction

  it('throws when group restriction enabled without group_name', () => {
    expect(() =>
      validateConfig({
        ...validBase,
        googleoauth: true,
        oauth2: { client_id: 'i', client_secret: 's', callback: 'c' },
        google_group_restriction: { enabled: true, api_key: 'key' },
      }),
    ).toThrow('group_name is required');
  });

  it('throws when group restriction enabled without api_key', () => {
    expect(() =>
      validateConfig({
        ...validBase,
        googleoauth: true,
        oauth2: { client_id: 'i', client_secret: 's', callback: 'c' },
        google_group_restriction: { enabled: true, group_name: 'grp' },
      }),
    ).toThrow('api_key is required');
  });

  // Multiple errors

  it('collects multiple errors into one throw', () => {
    expect(() => validateConfig({})).toThrow('Config validation failed');
    try {
      validateConfig({});
    } catch (e) {
      expect(e.message).toContain('config.secret');
      expect(e.message).toContain('config.content_dir');
      expect(e.message).toContain('config.image_url');
      expect(e.message).toContain('config.base_url');
    }
  });
});

describe('#languageLoad()', () => {
  it('loads English translations', () => {
    const lang = languageLoad('en');
    expect(lang).toHaveProperty('home');
    expect(lang).toHaveProperty('search');
  });

  it('loads Russian translations', () => {
    const lang = languageLoad('ru');
    expect(lang).toHaveProperty('home');
  });

  it('throws for nonexistent locale', () => {
    expect(() => languageLoad('nonexistent')).toThrow();
  });
});
