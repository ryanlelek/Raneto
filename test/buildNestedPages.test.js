import buildNestedPages from '../app/functions/buildNestedPages.js';
import contents_handler from '../app/core/contents.js';
import { createConfig } from './configHelpers.js';

const config = createConfig();

describe('#buildNestedPages()', () => {
  it('builds tree of pages', async () => {
    const pages = await contents_handler(null, config);
    const result = buildNestedPages(pages);

    expect(result.length).toEqual(2);
    expect(result[1].files.length).toEqual(4);
    expect(result[1].files[0].files[0].title).toEqual('Sub2 Page');
  });

  it('returns empty array for empty input', () => {
    const result = buildNestedPages([]);
    expect(result).toEqual([]);
  });

  it('returns top-level pages as-is', () => {
    const pages = [
      { slug: 'page-a', files: [] },
      { slug: 'page-b', files: [] },
    ];
    const result = buildNestedPages(pages);
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe('page-a');
    expect(result[1].slug).toBe('page-b');
  });

  it('nests child pages under their parent', () => {
    const pages = [
      { slug: 'parent', files: [] },
      { slug: 'parent/child', files: [] },
    ];
    const result = buildNestedPages(pages);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('parent');
    expect(result[0].files).toHaveLength(1);
    expect(result[0].files[0].slug).toBe('parent/child');
  });

  it('handles orphaned child pages without a parent', () => {
    const pages = [{ slug: 'missing-parent/child', files: [] }];
    const result = buildNestedPages(pages);
    expect(result).toHaveLength(0);
  });

  it('nests deeply nested pages correctly', () => {
    const pages = [
      { slug: 'a', files: [] },
      { slug: 'a/b', files: [] },
    ];
    const result = buildNestedPages(pages);
    expect(result).toHaveLength(1);
    expect(result[0].files[0].slug).toBe('a/b');
  });
});
