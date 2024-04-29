import path from 'node:path';
import { glob } from 'glob';
import content_processors from '../functions/contentProcessors.js';
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
    this.field('title');
    this.field('body');
    this.ref('id');
    documents.forEach((doc) => this.add(doc), this);
  });

  const results = idx.search(query);

  const searchResults = await Promise.all(
    results.map((result) =>
      processSearchResult(contentDir, config, query, result),
    ),
  );

  return searchResults;
}

async function processSearchResult(contentDir, config, query, result) {
  const page = await page_handler(contentDir + result.ref, config);
  page.excerpt = page.excerpt.replace(
    new RegExp(`(${query})`, 'gim'),
    '<span class="search-query">$1</span>',
  );

  return page;
}

export default handler;
