import { jest } from '@jest/globals';
import route_login from '../app/routes/login.route.js';

const config = {
  credentials: [
    { username: 'admin', password: 'correctpassword' },
    { username: 'editor', password: 'editorpass123' },
  ],
  lang: {
    api: {
      loginSuccessful: 'Login Successful',
      invalidCredentials: 'Invalid Credentials',
    },
  },
};

function createReq(username, password) {
  return {
    body: { username, password },
    session: {},
  };
}

function createRes() {
  const res = {
    _json: null,
    json: jest.fn((data) => {
      res._json = data;
    }),
  };
  return res;
}

describe('login route', () => {
  it('accepts valid credentials', () => {
    const handler = route_login(config);
    const req = createReq('admin', 'correctpassword');
    const res = createRes();

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 1,
      message: 'Login Successful',
    });
    expect(req.session.loggedIn).toBe(true);
    expect(req.session.username).toBe('admin');
  });

  it('accepts valid credentials for second user', () => {
    const handler = route_login(config);
    const req = createReq('editor', 'editorpass123');
    const res = createRes();

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 1,
      message: 'Login Successful',
    });
    expect(req.session.username).toBe('editor');
  });

  it('rejects wrong password', () => {
    const handler = route_login(config);
    const req = createReq('admin', 'wrongpassword');
    const res = createRes();

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 0,
      message: 'Invalid Credentials',
    });
    expect(req.session.loggedIn).toBeUndefined();
  });

  it('rejects wrong username', () => {
    const handler = route_login(config);
    const req = createReq('nonexistent', 'correctpassword');
    const res = createRes();

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      status: 0,
      message: 'Invalid Credentials',
    });
  });

  it('rejects empty credentials', () => {
    const handler = route_login(config);
    const req = createReq('', '');
    const res = createRes();

    handler(req, res);

    expect(res._json.status).toBe(0);
  });

  it('handles non-string username gracefully', () => {
    const handler = route_login(config);
    const req = { body: { username: null, password: 'test' }, session: {} };
    const res = createRes();

    handler(req, res);

    expect(res._json.status).toBe(0);
  });

  it('handles non-string password gracefully', () => {
    const handler = route_login(config);
    const req = { body: { username: 'admin', password: 123 }, session: {} };
    const res = createRes();

    handler(req, res);

    expect(res._json.status).toBe(0);
  });

  it('handles undefined body fields gracefully', () => {
    const handler = route_login(config);
    const req = { body: {}, session: {} };
    const res = createRes();

    handler(req, res);

    expect(res._json.status).toBe(0);
  });

  it('does not set session on failed login', () => {
    const handler = route_login(config);
    const req = createReq('admin', 'wrong');
    const res = createRes();

    handler(req, res);

    expect(req.session.loggedIn).toBeUndefined();
    expect(req.session.username).toBeUndefined();
  });

  it('rejects password that is a prefix of the real password', () => {
    const handler = route_login(config);
    const req = createReq('admin', 'correct');
    const res = createRes();

    handler(req, res);

    expect(res._json.status).toBe(0);
  });

  it('rejects password that extends the real password', () => {
    const handler = route_login(config);
    const req = createReq('admin', 'correctpasswordextra');
    const res = createRes();

    handler(req, res);

    expect(res._json.status).toBe(0);
  });

  it('is case-sensitive for username and password', () => {
    const handler = route_login(config);
    const req = createReq('Admin', 'correctpassword');
    const res = createRes();

    handler(req, res);

    expect(res._json.status).toBe(0);
  });
});
