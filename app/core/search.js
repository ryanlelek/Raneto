'use strict';

const path = require('path');
const glob = require('glob');
const lunr = require('lunr');
const contentProcessors = require('../functions/contentProcessors');
const utils = require('./utils');
const pageHandler = require('./page');

function handler (query, config) {
  const contentDir = utils.normalizeDir(path.normalize(config.content_dir));
  const documents = glob
    .sync(contentDir + '**/*.md')
    .map(filePath => contentProcessors.extractDocument(
      contentDir, filePath, config.debug
    ))
    .filter(doc => doc !== null);

  const idx = lunr(function () {
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
