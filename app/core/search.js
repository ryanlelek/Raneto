
'use strict';

const path              = require('path');
const contentProcessors = require('../functions/contentProcessors');
const utils             = require('./utils');
const pageHandler       = require('./page');

let instance = null;
let stemmers = null;

function getLunr (config) {
  if (instance === null) {
    instance = require('lunr');
    require('lunr-languages/lunr.stemmer.support')(instance);
    require('lunr-languages/lunr.multi')(instance);
    config.searchExtraLanguages.forEach(lang =>
      require('lunr-languages/lunr.' + lang)(instance)
    );
  }
  return instance;
}

function getStemmers (config) {
  if (stemmers === null) {
    const languages = ['en'].concat(config.searchExtraLanguages);
    stemmers = getLunr(config).multiLanguage.apply(null, languages);
  }
  return stemmers;
}

async function handler (query, config) {
  const contentDir = utils.normalizeDir(path.normalize(config.content_dir));
  const rawDocuments = await utils.promiseGlob(contentDir + '**/*.md');
  const potentialDocuments = await Promise.all(
    rawDocuments.map(filePath => contentProcessors.extractDocument(
      contentDir, filePath, config.debug
    ))
  );
  const documents = potentialDocuments
    .filter(doc => doc !== null);

  const lunrInstance = getLunr(config);
  const idx = lunrInstance(function () {
    this.use(getStemmers(config));
    this.field('title');
    this.field('body');
    this.ref('id');
    documents.forEach((doc) => this.add(doc), this);
  });

  const results = idx.search(query);

  const searchResults = await Promise.all(
    results.map(result => processSearchResult(contentDir, config, query, result))
  );

  return searchResults;
}

async function processSearchResult (contentDir, config, query, result) {
  const page = await pageHandler(contentDir + result.ref, config);
  page.excerpt = page.excerpt.replace(new RegExp('(' + query + ')', 'gim'), '<span class="search-query">$1</span>');

  return page;
}

exports.default = handler;
module.exports = exports.default;
