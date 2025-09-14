import path from 'node:path';
import { glob } from 'glob';
import content_processors from '../functions/content_processors.js';
import utils from './utils.js';
import page_handler from './page.js';
import lunr from './lunr.js';

async function handler(query, config) {
  const contentDir = utils.normalizeDir(path.normalize(config.content_dir));
  const rawDocuments = await glob(`${contentDir}**/*.md`);
  const potentialDocuments = await Promise.all(
    rawDocuments.map((filePath) =>
      content_processors.extractDocument(contentDir, filePath, config.debug),
    ),
  );
  const documents = potentialDocuments.filter((doc) => doc !== null);

  const lunrInstance = lunr.getLunr(config);
  const idx = lunrInstance(function () {
    this.use(lunr.getStemmers(config));
    this.field('title', { boost: 10 }); // Boost title matches
    this.field('body');
    this.ref('id');
    documents.forEach((doc) => this.add(doc), this);
  });

  // Clean and prepare the query
  const cleanQuery = query.trim();

  // Try exact search first
  let results = idx.search(cleanQuery);

  // If no results, try with OR operator for multi-word queries
  if (results.length === 0 && cleanQuery.includes(' ')) {
    const orQuery = cleanQuery.split(/\s+/).join(' OR ');
    results = idx.search(orQuery);
  }

  // If no results, try fuzzy search with edit distance 1
  if (results.length === 0 && cleanQuery.length > 2) {
    results = idx.search(`${cleanQuery}~1`);
  }

  // If still no results, try wildcard search
  if (results.length === 0) {
    results = idx.search(`${cleanQuery}*`);
  }

  // If still no results, try searching each word with fuzzy matching
  if (results.length === 0) {
    const words = cleanQuery.split(/\s+/).filter((word) => word.length > 2);
    const fuzzyQuery = words.map((word) => `${word}~1`).join(' OR ');
    if (fuzzyQuery) {
      results = idx.search(fuzzyQuery);
    }
  }

  const searchResults = await Promise.all(
    results.map(async (result) => {
      const processed = await processSearchResult(
        contentDir,
        config,
        query,
        result,
      );
      return processed;
    }),
  );

  return searchResults;
}

async function processSearchResult(contentDir, config, query, result) {
  // result.ref is the relative path from contentDir, we need to prepend contentDir
  const fullPath = path.join(contentDir, result.ref);
  const page = await page_handler(fullPath, config);
  // TODO: Improve handling
  if (page && page.excerpt) {
    page.excerpt = page.excerpt.replace(
      new RegExp(`(${query})`, 'gim'),
      '<span class="search-query">$1</span>',
    );
  }
  return page;
}

export default handler;
