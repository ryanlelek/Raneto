import { jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import route_page_edit from '../app/routes/page.edit.route.js';
import content_processors from '../app/functions/content_processors.js';

let tmpDir;
let config;

beforeAll(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'raneto-edit-test-'));
  config = {
    content_dir: tmpDir + path.sep,
    lang: {
      api: {
        pageSaved: 'Page Saved',
        invalidFile: 'Invalid file path',
      },
    },
  };
});

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true });
});

function createReq(file, content, meta = {}) {
  return {
    body: {
      file,
      content,
      meta_title: meta.title || '',
      meta_description: meta.description || '',
      meta_sort: meta.sort || '',
    },
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

describe('page edit route', () => {
  it('saves a page to disk', async () => {
    const filePath = path.join(tmpDir, 'test-page.md');
    await fs.writeFile(filePath, '---\nTitle: Old\n---\nOld content');

    const handler = route_page_edit(config);
    const req = createReq('test-page', 'New content', { title: 'New Title' });
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(0);
    const saved = await fs.readFile(filePath, 'utf8');
    expect(saved).toContain('New content');
    expect(saved).toContain('New Title');
  });

  it('sanitizes body content but not meta title', async () => {
    const filePath = path.join(tmpDir, 'sanitize-test.md');
    await fs.writeFile(filePath, '');

    const handler = route_page_edit(config);
    const req = createReq('sanitize-test', 'x < y and Tom & Jerry', {
      title: 'Tom & Jerry',
    });
    const res = createRes();

    await handler(req, res);

    const saved = await fs.readFile(filePath, 'utf8');
    // Body should have < escaped
    expect(saved).toContain('&lt;');
    // Body should have & escaped (when surrounded by spaces)
    expect(saved).toContain('Tom &amp; Jerry');
    // But meta title should NOT have & escaped
    const meta = content_processors.processMeta(saved);
    expect(meta.title).toBe('Tom & Jerry');
  });

  it('preserves meta title with special characters through YAML', async () => {
    const filePath = path.join(tmpDir, 'meta-special.md');
    await fs.writeFile(filePath, '');

    const handler = route_page_edit(config);
    const req = createReq('meta-special', 'Content here', {
      title: 'Page <draft>',
    });
    const res = createRes();

    await handler(req, res);

    const saved = await fs.readFile(filePath, 'utf8');
    const meta = content_processors.processMeta(saved);
    // Title should be preserved without HTML encoding
    expect(meta.title).toBe('Page <draft>');
  });

  it('rejects empty file parameter', async () => {
    const handler = route_page_edit(config);
    const req = createReq('', 'Content');
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(1);
  });

  it('rejects whitespace-only file parameter', async () => {
    const handler = route_page_edit(config);
    const req = createReq('   ', 'Content');
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(1);
  });

  it('handles category/file path splitting', async () => {
    const catDir = path.join(tmpDir, 'category');
    await fs.ensureDir(catDir);
    const filePath = path.join(catDir, 'subpage.md');
    await fs.writeFile(filePath, '');

    const handler = route_page_edit(config);
    const req = createReq('category/subpage', 'Category content');
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(0);
    const saved = await fs.readFile(filePath, 'utf8');
    expect(saved).toContain('Category content');
  });

  it('appends .md extension if file not found', async () => {
    const filePath = path.join(tmpDir, 'no-ext.md');
    await fs.writeFile(filePath, '');

    const handler = route_page_edit(config);
    // Request without .md — handler should find no-ext, then try no-ext.md
    const req = createReq('no-ext', 'Appended ext content');
    const res = createRes();

    await handler(req, res);

    expect(res._json.status).toBe(0);
    const saved = await fs.readFile(filePath, 'utf8');
    expect(saved).toContain('Appended ext content');
  });

  it('does not double-escape on repeated save cycles', async () => {
    const filePath = path.join(tmpDir, 'double-escape.md');
    await fs.writeFile(filePath, '');

    const handler = route_page_edit(config);

    // First save: content with & and <
    const req1 = createReq('double-escape', 'A & B and x < y', {
      title: 'Test & Title',
    });
    await handler(req1, createRes());
    const saved1 = await fs.readFile(filePath, 'utf8');

    // Simulate browser load: entities in file get decoded by browser
    // Then user saves again without changes
    const body = content_processors.stripMeta(saved1);
    // Browser decodes &lt; → < and &amp; → &
    const browserDecoded = body.replace(/&lt;/g, '<').replace(/&amp;/g, '&');

    const meta = content_processors.processMeta(saved1);

    const req2 = createReq('double-escape', browserDecoded, {
      title: meta.title,
    });
    await handler(req2, createRes());
    const saved2 = await fs.readFile(filePath, 'utf8');

    // File should be identical after second save
    expect(saved2).toBe(saved1);
  });
});
