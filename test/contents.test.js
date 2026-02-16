import { jest } from '@jest/globals';
import contents_handler from '../app/core/contents.js';
import { createConfig } from './config-helpers.js';

const config = createConfig();

describe('#getPages()', () => {
  it('returns an array of categories and pages', async () => {
    const result = await contents_handler(null, config);
    expect(result[0]).toHaveProperty('is_index', true);
    expect(result[0].files[0]).toHaveProperty(
      'title',
      'Special Characters Page',
    );
    expect(result[1]).toHaveProperty('slug', 'sub');
    expect(result[1].files[0]).toHaveProperty('title', 'Example Sub Page');
  });

  it('marks activePageSlug as active', async () => {
    const result = await contents_handler('/special-chars', config);
    expect(result[0]).toHaveProperty('active', true);
    expect(result[0].files[0]).toHaveProperty('active', true);
    expect(result[1]).toHaveProperty('active', false);
    expect(result[1].files[0]).toHaveProperty('active', false);
  });

  it('adds show_on_home property to directory', async () => {
    const result = await contents_handler(null, config);
    expect(result[0]).toHaveProperty('show_on_home', true);
  });

  it('adds show_on_home property to files', async () => {
    const result = await contents_handler(null, config);
    expect(result[0].files[0]).toHaveProperty('show_on_home', true);
  });

  it('loads meta show_on_home value from directory', async () => {
    const result = await contents_handler(null, config);
    expect(result[3]).toHaveProperty('show_on_home', false);
  });

  it('loads meta show_on_home value from file', async () => {
    const result = await contents_handler(null, config);
    expect(result[0].files[4]).toHaveProperty('show_on_home', false);
  });

  it('applies show_on_home_default in absence of meta for directories', async () => {
    const result = await contents_handler(null, {
      ...config,
      show_on_home_default: false,
    });
    expect(result[1]).toHaveProperty('show_on_home', false);
  });

  it('applies show_on_home_default in absence of meta for files', async () => {
    const result = await contents_handler(null, {
      ...config,
      show_on_home_default: false,
    });
    expect(result[1].files[0]).toHaveProperty('show_on_home', false);
  });

  it('category index always shows on home', async () => {
    const result = await contents_handler(null, {
      ...config,
      show_on_home_default: false,
    });
    expect(result[0]).toHaveProperty('show_on_home', true);
  });

  it('adds show_on_menu property to directory', async () => {
    const result = await contents_handler(null, config);
    expect(result[0]).toHaveProperty('show_on_menu', true);
  });

  it('adds show_on_menu property to files', async () => {
    const result = await contents_handler(null, config);
    expect(result[0].files[0]).toHaveProperty('show_on_menu', true);
  });

  it('loads meta show_on_menu value from directory', async () => {
    const result = await contents_handler(null, config);
    expect(result[3]).toHaveProperty('show_on_menu', false);
  });

  it('loads meta show_on_menu value from file', async () => {
    const result = await contents_handler(null, config);
    expect(result[0].files[4]).toHaveProperty('show_on_menu', false);
  });

  it('applies show_on_menu_default in absence of meta for directories', async () => {
    const result = await contents_handler(null, {
      ...config,
      show_on_menu_default: false,
    });
    expect(result[1]).toHaveProperty('show_on_menu', false);
  });

  it('applies show_on_menu_default in absence of meta for files', async () => {
    const result = await contents_handler(null, {
      ...config,
      show_on_menu_default: false,
    });
    expect(result[1].files[0]).toHaveProperty('show_on_menu', false);
  });

  it('category main always shows on menu', async () => {
    const result = await contents_handler(null, {
      ...config,
      show_on_menu_default: false,
    });
    expect(result[0]).toHaveProperty('show_on_menu', true);
  });

  it('logs ignored content when debug is true', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await contents_handler(null, { ...config, debug: true });
    spy.mockRestore();
  });

  it('strips index.md from file slugs', async () => {
    const result = await contents_handler(null, config);
    for (const category of result) {
      for (const file of category.files) {
        expect(file.slug).not.toMatch(/index\.md$/);
      }
    }
  });

  it('reads sort file for category when category_sort is true', async () => {
    const result = await contents_handler(null, config);
    const sortedDir = result.find((cat) => cat.slug === 'sub/sorted_dir');
    expect(sortedDir).toBeDefined();
    expect(sortedDir.sort).toBe(7);
  });

  it('logs debug info for directories without meta file', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await contents_handler(null, { ...config, debug: true });
    const metaCalls = spy.mock.calls.filter(
      (call) => typeof call[0] === 'string' && call[0].includes('No meta'),
    );
    expect(metaCalls.length).toBeGreaterThan(0);
    spy.mockRestore();
  });

  it('logs debug info for directories without sort file', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await contents_handler(null, { ...config, debug: true });
    const sortCalls = spy.mock.calls.filter(
      (call) => typeof call[0] === 'string' && call[0].includes('No sort'),
    );
    expect(sortCalls.length).toBeGreaterThan(0);
    spy.mockRestore();
  });
});
