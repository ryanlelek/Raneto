'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('underscore');
const _s = require('underscore.string');
const yaml = require('js-yaml');
const utils = require('./utils');
const contentProcessors = require('../functions/contentProcessors');

function handler (activePageSlug, config) {
  activePageSlug = activePageSlug || '';
  const baseSlug = activePageSlug.split(/[\\/]/).slice(0, -1).join('/');
  const page_sort_meta = config.page_sort_meta || '';
  const category_sort = config.category_sort || false;
  const contentDir = utils.normalizeDir(path.normalize(config.content_dir));

  const files = glob.sync(contentDir + '**/*');
  const content_dir = path.normalize(contentDir);
  const filesProcessed = [];

  filesProcessed.push({
    slug: '.',
    title: '',
    show_on_home: true,
    is_index: true,
    active: (baseSlug === ''),
    class: 'category-index',
    sort: 0,
    files: []
  });

  files.forEach(filePath => {

    const shortPath = path.normalize(filePath).replace(content_dir, '').trim();
    const fileSlug = shortPath.split('\\').join('/');
    let stat = fs.lstatSync(filePath);

    if (stat.isSymbolicLink()) {
      stat = fs.lstatSync(fs.readlinkSync(filePath));
    }

    if (stat.isDirectory()) {

      let sort = 0;
      // ignore directories that has an ignore file under it
      const ignoreFile = contentDir + shortPath + '/ignore';

      if (fs.existsSync(ignoreFile) && fs.lstatSync(ignoreFile).isFile()) {
        return true;
      }

      let dirMetadata = {};
      try {
        const metaFile = fs.readFileSync(contentDir + shortPath + '/meta');
        dirMetadata = contentProcessors.cleanObjectStrings(yaml.safeLoad(metaFile.toString('utf-8')));
      } catch (e) {
        if (config.debug) {
          console.log('No meta file for', contentDir + shortPath);
        }
      }

      if (category_sort && !dirMetadata.sort) {
        try {
          const sortFile = fs.readFileSync(contentDir + shortPath + '/sort');
          sort = parseInt(sortFile.toString('utf-8'), 10);
        } catch (e) {
          if (config.debug) {
            console.log('No sort file for', contentDir + shortPath);
          }
        }
      }

      filesProcessed.push({
        slug: shortPath,
        title: dirMetadata.title || _s.titleize(_s.humanize(path.basename(shortPath))),
        show_on_home: dirMetadata.show_on_home ? (dirMetadata.show_on_home === 'true') : config.show_on_home_default,
        is_index: false,
        is_directory: true,
        active: activePageSlug.startsWith('/' + fileSlug),
        class: 'category-' + contentProcessors.cleanString(shortPath),
        sort: dirMetadata.sort || sort,
        files: []
      });

    }

    if (stat.isFile() && path.extname(shortPath) === '.md') {
      try {

        const file = fs.readFileSync(filePath);
        let slug = fileSlug;
        let pageSort = 0;

        if (fileSlug.indexOf('index.md') > -1) {
          slug = slug.replace('index.md', '');
        }

        slug = slug.replace('.md', '').trim();

        const dir = path.dirname(shortPath);
        const meta = contentProcessors.processMeta(file.toString('utf-8'));

        if (page_sort_meta && meta[page_sort_meta]) {
          pageSort = parseInt(meta[page_sort_meta], 10);
        }

        const val = _.find(filesProcessed, item => item.slug === dir);
        val.files.push({
          slug: slug,
          title: meta.title ? meta.title : contentProcessors.slugToTitle(slug),
          show_on_home: meta.show_on_home ? (meta.show_on_home === 'true') : config.show_on_home_default,
          is_directory: false,
          active: (activePageSlug.trim() === '/' + slug),
          sort: pageSort
        });

      } catch (e) {
        if (config.debug) {
          console.log(e);
        }
      }
    }
  });

  const sortedFiles = _.sortBy(filesProcessed, cat => cat.sort);
  sortedFiles.forEach(category => {
    category.files = _.sortBy(category.files, file => file.sort);
  });

  return sortedFiles;
}

exports.default = handler;
module.exports = exports.default;
