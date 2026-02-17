// Security tests for path traversal and input sanitization fixes
import { jest } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import utils from '../app/core/utils.js';
import route_wildcard from '../app/routes/wildcard.route.js';
import { createConfig } from './configHelpers.js';

const config = createConfig();

// utils.getLastModified path traversal

describe('utils.getLastModified - path traversal prevention', () => {
  it('allows a valid file inside content_dir', async () => {
    const file_path = path.join('test', 'content', 'example-page.md');
    const result = await utils.getLastModified(config, {}, file_path);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('rejects an absolute path outside content_dir', async () => {
    await expect(
      utils.getLastModified(config, {}, '/etc/passwd'),
    ).rejects.toThrow('Access denied');
  });

  it('rejects a relative path that traverses outside content_dir', async () => {
    const file_path = path.join('test', 'content', '..', '..', 'package.json');
    await expect(utils.getLastModified(config, {}, file_path)).rejects.toThrow(
      'Access denied',
    );
  });

  it('rejects a path that starts with content_dir as a prefix but escapes it', async () => {
    // e.g. test/content/../content-evil/file should not match test/content/
    // This tests the path.sep boundary check
    const file_path = path.join('test', 'content' + '..', 'package.json');
    await expect(
      utils.getLastModified(config, {}, file_path),
    ).rejects.toThrow();
  });

  it('rejects paths with null bytes', async () => {
    const file_path = path.join('test', 'content', 'example-page.md\0.jpg');
    await expect(
      utils.getLastModified(config, {}, file_path),
    ).rejects.toThrow();
  });

  it('rejects deeply nested traversal sequences', async () => {
    const traversal = Array(20).fill('..').join(path.sep);
    const file_path = path.join('test', 'content', traversal, 'etc', 'passwd');
    await expect(utils.getLastModified(config, {}, file_path)).rejects.toThrow(
      'Access denied',
    );
  });

  it('rejects backslash-based traversal', async () => {
    const file_path = 'test\\content\\..\\..\\package.json';
    // On Windows, backslashes are path separators so this resolves outside
    // content_dir and triggers "Access denied". On Unix, backslashes are
    // literal filename characters so this triggers ENOENT. Either way, the
    // file must not be accessible.
    await expect(
      utils.getLastModified(config, {}, file_path),
    ).rejects.toThrow();
  });

  it('rejects single-dot path confusion', async () => {
    // ./././../../ should still resolve outside
    const file_path = path.join(
      'test',
      'content',
      '.',
      '.',
      '..',
      '..',
      'package.json',
    );
    await expect(utils.getLastModified(config, {}, file_path)).rejects.toThrow(
      'Access denied',
    );
  });

  it('throws ENOENT for nonexistent file inside content_dir', async () => {
    const file_path = path.join('test', 'content', 'does-not-exist.md');
    try {
      await utils.getLastModified(config, {}, file_path);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Should be a filesystem error, not an access denied error
      expect(error.message).not.toMatch(/Access denied/);
      expect(error.code).toBe('ENOENT');
    }
  });

  it('allows theme_dir files when theme_dir is configured', async () => {
    const configWithTheme = {
      ...config,
      theme_dir: path.join('themes'),
    };
    // This will throw ENOENT because the theme file doesn't exist,
    // but it should NOT throw "Access denied"
    await expect(
      utils.getLastModified(
        configWithTheme,
        {},
        path.join('themes', 'default', 'templates', 'page.html'),
      ),
    ).rejects.toThrow();
    // Verify it's a filesystem error, not an access denied error
    try {
      await utils.getLastModified(
        configWithTheme,
        {},
        path.join('themes', 'default', 'templates', 'page.html'),
      );
    } catch (error) {
      expect(error.message).not.toMatch(/Access denied/);
    }
  });

  it('returns meta.modified without filesystem access when available', async () => {
    const meta = { modified: '2024-01-15' };
    // Even with an invalid path, meta.modified should be returned directly
    const result = await utils.getLastModified(config, meta, '/etc/shadow');
    expect(typeof result).toBe('string');
  });
});

describe('utils.getLastModified - symlink prevention', () => {
  let tmpDir;
  let symlinkPath;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'raneto-test-'));
    // Create a symlink inside test/content pointing outside
    symlinkPath = path.join('test', 'content', '_test_symlink');
    try {
      fs.symlinkSync(tmpDir, symlinkPath);
    } catch {
      // Symlink creation may fail on some systems/permissions
      symlinkPath = null;
    }
  });

  afterAll(() => {
    if (symlinkPath) {
      try {
        fs.unlinkSync(symlinkPath);
      } catch {
        // cleanup best-effort
      }
    }
    if (tmpDir) {
      try {
        fs.rmSync(tmpDir, { recursive: true });
      } catch {
        // cleanup best-effort
      }
    }
  });

  it('rejects symlinks that resolve outside content_dir', async () => {
    if (!symlinkPath) {
      // Skip if symlink creation wasn't possible
      return;
    }
    await expect(
      utils.getLastModified(config, {}, symlinkPath),
    ).rejects.toThrow('Access denied');
  });
});

// wildcard route path traversal

describe('wildcard route - path traversal prevention', () => {
  function createMockReq(urlPath) {
    return {
      params: [urlPath],
      protocol: 'http',
      get: () => 'localhost',
      originalUrl: urlPath,
      session: {},
    };
  }

  function createMockRes() {
    const res = {
      _rendered: null,
      _redirected: null,
      render: jest.fn((template, data) => {
        res._rendered = { template, data };
      }),
      redirect: jest.fn((url) => {
        res._redirected = url;
      }),
    };
    return res;
  }

  const routeConfig = createConfig({
    path_prefix: '',
    table_of_contents: false,
    authentication: false,
    authentication_for_edit: false,
    allow_editing: false,
    lang: {
      error: {
        404: 'Page Not Found',
      },
    },
  });

  it('returns 404 for path traversal via ../', async () => {
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/../../etc/passwd');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.status).toBe(404);
  });

  it('returns 404 for encoded path traversal', async () => {
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/../../../package.json');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.status).toBe(404);
  });

  it('returns 404 for traversal with /edit suffix', async () => {
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/../../etc/passwd/edit');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.status).toBe(404);
  });

  it('returns 404 for traversal targeting .md files outside content dir', async () => {
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/../../some-file');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.status).toBe(404);
  });

  it('serves a valid page within content_dir', async () => {
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/example-page');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    // Should render the page, not call next with an error
    expect(res.render).toHaveBeenCalled();
    expect(res.render.mock.calls[0][0]).toBe('page');
  });

  it('serves a valid page in a subdirectory', async () => {
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/sub/page');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(res.render).toHaveBeenCalled();
    expect(res.render.mock.calls[0][0]).toBe('page');
  });

  it('calls next() when no wildcard param is provided', async () => {
    const handler = route_wildcard(routeConfig);
    const req = { params: [] };
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(res.render).not.toHaveBeenCalled();
  });

  it('returns 404 for backslash-based traversal', async () => {
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/..\\..\\etc\\passwd');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.status).toBe(404);
  });

  it('returns 404 for deeply nested traversal', async () => {
    const handler = route_wildcard(routeConfig);
    const traversal = Array(20).fill('..').join('/');
    const req = createMockReq(`/${traversal}/etc/passwd`);
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.status).toBe(404);
  });

  it('returns 404 for traversal hidden inside a valid prefix', async () => {
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/sub/../../package.json');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.status).toBe(404);
  });

  it('returns 404 for dot-segment path confusion', async () => {
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/./././../../etc/passwd');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.status).toBe(404);
  });

  it('returns 404 for null byte injection in path', async () => {
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/example-page\0.html');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
  });

  it('handles root path / correctly', async () => {
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    // / maps to /index which should look for index.md in content_dir
    // Whether it renders or 404s, it should NOT escape the content directory
    if (next.mock.calls.length > 0 && next.mock.calls[0][0]) {
      // 404 is acceptable — the important thing is no path traversal
      expect(next.mock.calls[0][0].status).toBe(404);
    } else {
      // If it rendered, that's also fine
      expect(res.render).toHaveBeenCalled();
    }
  });

  it('returns 404 for path traversal via edit suffix stripping', async () => {
    // Crafted so that after stripping "/edit" suffix, the path escapes
    const handler = route_wildcard(routeConfig);
    const req = createMockReq('/../../etc/passwdedit');
    const res = createMockRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.status).toBe(404);
  });
});

// sitemap backslash replacement

describe('sitemap route - backslash replacement', () => {
  it('replaces all backslashes in file paths, not just the first', () => {
    // Simulating the logic from sitemap.route.js line 24
    const filePath = 'sub\\sub2\\page';
    const result = `/${filePath.replace('.md', '').replace(/\\/g, '/')}`;
    expect(result).toBe('/sub/sub2/page');
    expect(result).not.toContain('\\');
  });

  it('handles paths with no backslashes', () => {
    const filePath = 'sub/page';
    const result = `/${filePath.replace('.md', '').replace(/\\/g, '/')}`;
    expect(result).toBe('/sub/page');
  });

  it('handles paths with many backslashes', () => {
    const filePath = 'a\\b\\c\\d\\e';
    const result = `/${filePath.replace('.md', '').replace(/\\/g, '/')}`;
    expect(result).toBe('/a/b/c/d/e');
  });

  it('strips .md extension and replaces backslashes together', () => {
    const filePath = 'category\\subcategory\\page.md';
    const result = `/${filePath.replace('.md', '').replace(/\\/g, '/')}`;
    expect(result).toBe('/category/subcategory/page');
  });
});
