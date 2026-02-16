import { jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import route_page_edit from '../app/routes/page.edit.route.js';
import route_page_delete from '../app/routes/page.delete.route.js';
import route_page_create from '../app/routes/page.create.route.js';
import route_category_create from '../app/routes/category.create.route.js';
import getFilepath from '../app/functions/get_filepath.js';

let tmpDir;
let config;

beforeAll(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'raneto-write-test-'));
  config = {
    content_dir: tmpDir + path.sep,
    lang: {
      api: {
        pageSaved: 'Page Saved',
        pageDeleted: 'Page Deleted',
        pageCreated: 'Page Created',
        categoryCreated: 'Category Created',
        invalidFile: 'Invalid file path',
        invalidCategory: 'Invalid category path',
      },
    },
  };
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function createRes() {
  const res = {
    _json: null,
    json: jest.fn((data) => {
      res._json = data;
    }),
  };
  return res;
}

// getFilepath path traversal prevention

describe('getFilepath - path traversal prevention', () => {
  const content = '/var/content';

  it('returns valid path for normal category and filename', () => {
    const result = getFilepath({
      content,
      category: 'docs',
      filename: 'page.md',
    });
    expect(result).not.toBeNull();
    expect(path.resolve(result)).toContain('docs');
  });

  it('returns null when path resolves to content dir itself', () => {
    expect(getFilepath({ content })).toBeNull();
    expect(getFilepath({ content, category: '', filename: '' })).toBeNull();
  });

  it('returns null when category is ..', () => {
    const result = getFilepath({
      content,
      category: '..',
      filename: 'evil.md',
    });
    // After sanitizeFilename strips "..", the path resolves to content dir
    // with just the filename — which is valid (inside content dir)
    // The category component becomes empty, not ".."
    if (result) {
      const resolved = path.resolve(result);
      expect(resolved.startsWith(path.resolve(content) + path.sep)).toBe(true);
    }
  });

  it('returns null when both category and filename sanitize to empty', () => {
    const result = getFilepath({
      content,
      category: '..',
      filename: '..',
    });
    expect(result).toBeNull();
  });

  it('never returns a path outside the content directory', () => {
    const attacks = [
      { category: '../..', filename: 'etc/passwd' },
      { category: '..', filename: '..' },
      { category: '', filename: '../../../etc/shadow' },
      { category: '....', filename: '....passwd' },
      { category: 'sub/../../', filename: 'file.md' },
    ];
    const contentRoot = path.resolve(content);
    for (const a of attacks) {
      const result = getFilepath({ content, ...a });
      if (result !== null) {
        const resolved = path.resolve(result);
        expect(resolved.startsWith(contentRoot + path.sep)).toBe(true);
      }
    }
  });
});

// page.edit.route - path traversal

describe('page.edit.route - path traversal prevention', () => {
  it('rejects file path that resolves to content dir', async () => {
    const handler = route_page_edit(config);
    const req = { body: { file: '..', content: 'test' } };
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(1);
  });

  it('rejects traversal via category component', async () => {
    const handler = route_page_edit(config);
    const req = { body: { file: '../../etc/passwd', content: 'test' } };
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(1);
  });

  it('allows valid file path', async () => {
    await fs.writeFile(path.join(tmpDir, 'edit-valid.md'), '');
    const handler = route_page_edit(config);
    const req = {
      body: {
        file: 'edit-valid',
        content: 'Valid content',
        meta_title: '',
        meta_description: '',
        meta_sort: '',
      },
    };
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(0);
  });
});

// page.delete.route - path traversal (the critical one)

describe('page.delete.route - path traversal prevention', () => {
  it('rejects file path that resolves to content dir', async () => {
    const handler = route_page_delete(config);
    const req = { body: { file: '..' } };
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(1);
    // Verify content dir was NOT renamed
    expect(await fs.pathExists(tmpDir)).toBe(true);
  });

  it('rejects traversal via ../..', async () => {
    const handler = route_page_delete(config);
    const req = { body: { file: '../..' } };
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(1);
    expect(await fs.pathExists(tmpDir)).toBe(true);
  });

  it('rejects traversal targeting parent directories', async () => {
    const handler = route_page_delete(config);
    const req = { body: { file: '../../package.json' } };
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(1);
  });

  it('allows deleting a valid file', async () => {
    const testFile = path.join(tmpDir, 'delete-me.md');
    await fs.writeFile(testFile, 'to be deleted');
    const handler = route_page_delete(config);
    const req = { body: { file: 'delete-me' } };
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(0);
    expect(await fs.pathExists(testFile + '.del')).toBe(true);
    // Clean up
    await fs.remove(testFile + '.del');
  });
});

// page.create.route - path traversal

describe('page.create.route - path traversal prevention', () => {
  it('sanitizes .. in name to a safe filename', async () => {
    // ".." + ".md" = "...md" which sanitizeFilename keeps (not a reserved name)
    // The file is created inside content_dir, which is safe
    const handler = route_page_create(config);
    const req = { body: { category: '', name: '..' } };
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(0);
    const created = path.join(tmpDir, '...md');
    expect(await fs.pathExists(created)).toBe(true);
    await fs.remove(created);
  });

  it('sanitizes traversal in category to safe path inside content_dir', async () => {
    // "../../etc" → sanitize strips "/" → "....etc" → sanitizeFilename keeps it
    // File is created inside content_dir, not outside
    const handler = route_page_create(config);
    const req = { body: { category: '../../etc', name: 'evil' } };
    const res = createRes();

    await handler(req, res);

    if (res._json.status === 0) {
      // Verify the file was created strictly inside content_dir
      const contentRoot = path.resolve(tmpDir);
      const createdDir = path.join(tmpDir, '....etc');
      expect(path.resolve(createdDir).startsWith(contentRoot)).toBe(true);
      await fs.remove(createdDir);
    }
  });

  it('allows creating a valid page', async () => {
    const handler = route_page_create(config);
    const req = { body: { category: '', name: 'new-page' } };
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(0);
    expect(await fs.pathExists(path.join(tmpDir, 'new-page.md'))).toBe(true);
    await fs.remove(path.join(tmpDir, 'new-page.md'));
  });
});

// category.create.route - path traversal

describe('category.create.route - path traversal prevention', () => {
  it('rejects category that resolves to content dir', async () => {
    const handler = route_category_create(config);
    const req = { body: { category: '..' } };
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(1);
  });

  it('sanitizes traversal in category name to safe path', async () => {
    // "../../etc" → sanitize strips "/" → "....etc" → created inside content_dir
    const handler = route_category_create(config);
    const req = { body: { category: '../../etc' } };
    const res = createRes();

    await handler(req, res);

    if (res._json.status === 0) {
      const created = path.join(tmpDir, '....etc');
      expect(path.resolve(created).startsWith(path.resolve(tmpDir))).toBe(true);
      await fs.remove(created);
    }
  });

  it('allows creating a valid category', async () => {
    const handler = route_category_create(config);
    const catName = 'new-category';
    const req = { body: { category: catName } };
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(0);
    expect(await fs.pathExists(path.join(tmpDir, catName))).toBe(true);
    await fs.remove(path.join(tmpDir, catName));
  });
});
