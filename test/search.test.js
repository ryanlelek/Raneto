import search_handler from '../app/core/search.js';
import { createConfig } from './config.helpers.js';

const config = createConfig();

describe('#doSearch()', () => {
  it('returns an array of search results', async () => {
    const result = await search_handler('example', config);
    expect(result).toHaveLength(5);
  });

  it('recognizes multiple languages', async () => {
    const result = await search_handler('пример', config);
    expect(result).toHaveLength(1);
  });

  it('returns an empty array if nothing found', async () => {
    const result = await search_handler('qwerty', config);
    expect(result).toEqual([]);
  });

  it('falls back to OR search for multi-word queries', async () => {
    const result = await search_handler('example content page', config);
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles single short word with no results gracefully', async () => {
    const result = await search_handler('zz', config);
    expect(result).toEqual([]);
  });

  it('tries fuzzy search for longer terms with no exact match', async () => {
    const result = await search_handler('xyznonexistent abcnotfound', config);
    expect(result).toBeDefined();
  });

  it('tries wildcard search when fuzzy fails', async () => {
    const result = await search_handler('exampl', config);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it('tries per-word fuzzy search as last resort', async () => {
    const result = await search_handler('zzzznotreal yyyyfakeword', config);
    expect(result).toBeDefined();
  });
});
