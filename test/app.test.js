import initialize from '../app/index.js';
import { createConfig } from './configHelpers.js';

const baseConfig = () => ({
  ...createConfig(),
  session_secret: 'a-valid-session-secret-for-testing-purposes',
});

describe('initialize() - trust proxy', () => {
  it('sets trust proxy on app when trust_proxy is configured', () => {
    const config = { ...baseConfig(), trust_proxy: 1 };
    const app = initialize(config);
    expect(app.get('trust proxy')).toBe(1);
  });

  it('leaves trust proxy at Express default when trust_proxy is not configured', () => {
    const config = baseConfig();
    const app = initialize(config);
    expect(app.get('trust proxy')).toBe(false);
  });
});
