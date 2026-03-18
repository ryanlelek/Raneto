import applyEnvOverrides from '../app/core/envOverrides.js';

function makeConfig(overrides = {}) {
  return { credentials: [], ...overrides };
}

describe('applyEnvOverrides - ADMIN_USERNAME / ADMIN_PASSWORD', () => {
  it('prepends admin credential when both are set', () => {
    const config = makeConfig();
    applyEnvOverrides(config, {
      ADMIN_USERNAME: 'adminuser',
      ADMIN_PASSWORD: 'adminpassword',
    });
    expect(config.credentials[0]).toEqual({
      username: 'adminuser',
      password: 'adminpassword',
    });
  });

  it('prepends admin credential as first element when existing credentials are present', () => {
    const config = makeConfig({
      credentials: [{ username: 'other', password: 'otherpass' }],
    });
    applyEnvOverrides(config, {
      ADMIN_USERNAME: 'adminuser',
      ADMIN_PASSWORD: 'adminpassword',
    });
    expect(config.credentials[0]).toEqual({
      username: 'adminuser',
      password: 'adminpassword',
    });
    expect(config.credentials[1]).toEqual({
      username: 'other',
      password: 'otherpass',
    });
  });

  it('initializes credentials array when not present and both env vars set', () => {
    const config = {};
    applyEnvOverrides(config, {
      ADMIN_USERNAME: 'adminuser',
      ADMIN_PASSWORD: 'adminpassword',
    });
    expect(Array.isArray(config.credentials)).toBe(true);
    expect(config.credentials[0].username).toBe('adminuser');
  });

  it('throws when only ADMIN_USERNAME is set', () => {
    expect(() =>
      applyEnvOverrides(makeConfig(), { ADMIN_USERNAME: 'adminuser' }),
    ).toThrow('ADMIN_PASSWORD');
  });

  it('throws when only ADMIN_PASSWORD is set', () => {
    expect(() =>
      applyEnvOverrides(makeConfig(), { ADMIN_PASSWORD: 'adminpassword' }),
    ).toThrow('ADMIN_USERNAME');
  });

  it('does not modify credentials when neither env var is set', () => {
    const config = makeConfig();
    applyEnvOverrides(config, {});
    expect(config.credentials).toEqual([]);
  });
});

describe('applyEnvOverrides - general env vars', () => {
  it('applies SESSION_SECRET to config.session_secret', () => {
    const config = makeConfig();
    applyEnvOverrides(config, { SESSION_SECRET: 'my-secret-value' });
    expect(config.session_secret).toBe('my-secret-value');
  });

  it('coerces AUTHENTICATION to boolean', () => {
    const config = makeConfig();
    applyEnvOverrides(config, { AUTHENTICATION: 'true' });
    expect(config.authentication).toBe(true);

    applyEnvOverrides(config, { AUTHENTICATION: 'false' });
    expect(config.authentication).toBe(false);
  });

  it('coerces ALLOW_EDITING to boolean', () => {
    const config = makeConfig();
    applyEnvOverrides(config, { ALLOW_EDITING: 'true' });
    expect(config.allow_editing).toBe(true);
  });
});
