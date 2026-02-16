import { jest } from '@jest/globals';
import path from 'node:path';
import page_handler from '../app/core/page.js';
import { createConfig } from './config-helpers.js';

const config = createConfig();

describe('#getPage()', () => {
  it('returns an array of values for a given page', async () => {
    const result = await page_handler(
      path.join(config.content_dir, 'example-page.md'),
      config,
    );
    expect(result).toHaveProperty('slug', 'example-page');
    expect(result).toHaveProperty('title', 'Example Page');
    expect(result).toHaveProperty('body');
    expect(result).toHaveProperty('excerpt');
  });

  it('returns null if no page found', async () => {
    const result = await page_handler(
      path.join(config.content_dir, 'nonexistent-page.md'),
      config,
    );
    expect(result).toBeNull();
  });

  it('strips index.md from slug', async () => {
    const result = await page_handler(
      path.join(config.content_dir, 'sub', 'index.md'),
      config,
    );
    expect(result).not.toBeNull();
    expect(result.slug).not.toContain('index.md');
    expect(result.slug).toBe('sub/');
  });

  it('logs error when debug is true for missing file', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const result = await page_handler(
      path.join(config.content_dir, 'nonexistent.md'),
      { ...config, debug: true },
    );
    expect(result).toBeNull();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('does not log when debug is false for missing file', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const result = await page_handler(
      path.join(config.content_dir, 'nonexistent.md'),
      { ...config, debug: false },
    );
    expect(result).toBeNull();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
