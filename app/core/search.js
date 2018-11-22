
'use strict';

const path              = require('path');
const glob              = require('glob');
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

function handler (query, config) {
  const contentDir = utils.normalizeDir(path.normalize(config.content_dir));
  const documents = glob
    .sync(contentDir + '**/*.md')
    .map(filePath => contentProcessors.extractDocument(
      contentDir, filePath, config.debug
    ))
    .filter(doc => doc !== null);

  const lunrInstance = getLunr(config);
  const idx = lunrInstance(function () {
    this.use(getStemmers(config));
    this.field('title');
    this.field('body');
    this.ref('id');
    documents.forEach((doc) => this.add(doc), this);
  });

  const results       = idx.search(query);
  const searchResults = [];

  results.forEach(result => {
    const p = pageHandler(contentDir + result.ref, config);
    p.excerpt = p.excerpt.replace(new RegExp('(' + query + ')', 'gim'), '<span class="search-query">$1</span>');
    searchResults.push(p);
  });

  return searchResults;
}

exports.default = handler;
module.exports = exports.default;
