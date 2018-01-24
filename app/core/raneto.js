'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const _ = require('underscore');
const _s = require('underscore.string');
const marked = require('marked');
const lunr = require('lunr');
const yaml = require('js-yaml');
const contentProcessors = require('../functions/contentProcessors');

const default_config = {
  // The base URL of your site (allows you to use %base_url% in Markdown files)
  base_url: '',
  // The base URL of your images folder (allows you to use %image_url% in Markdown files)
  image_url: '/images',
  // Excerpt length (used in search)
  excerpt_length: 400,
  // The meta value by which to sort pages (value should be an integer)
  // If this option is blank pages will be sorted alphabetically
  page_sort_meta: 'sort',
  // Should categories be sorted numerically (true) or alphabetically (false)
  // If true category folders need to contain a "sort" file with an integer value
  category_sort: true,
  // Controls behavior of home page if meta ShowOnHome is not present. If set to true
  // all categories or files that do not specify ShowOnHome meta property will be shown
  show_on_home_default: true,
  // Specify the path of your content folder where all your '.md' files are located
  content_dir: './content/',
  // Toggle debug logging
  debug: false
};

function patch_content_dir (content_dir) {
  return content_dir.replace(/\\/g, '/');
}

class Raneto {

  constructor () {
    this.config = Object.assign({}, default_config);  // Clone default config
  }

  // Get a page
  getPage (filePath) {
    try {
      const file = fs.readFileSync(filePath);
      let slug = patch_content_dir(filePath).replace(patch_content_dir(this.config.content_dir), '').trim();

      if (slug.indexOf('index.md') > -1) {
        slug = slug.replace('index.md', '');
      }
      slug = slug.replace('.md', '').trim();

      const meta    = contentProcessors.processMeta(file.toString('utf-8'));
      let content = contentProcessors.stripMeta(file.toString('utf-8'));
      content     = contentProcessors.processVars(content, this.config.variables, this.config.base_url, this.config.image_url);
      const html    = marked(content);

      return {
        slug    : slug,
        title   : meta.title ? meta.title : contentProcessors.slugToTitle(slug),
        body    : html,
        excerpt : _s.prune(_s.stripTags(_s.unescapeHTML(html)), (this.config.excerpt_length || 400))
      };
    } catch (e) {
      if (this.config.debug) { console.log(e); }
      return null;
    }
  }

  // Get a structured array of the contents of contentDir
  getPages (activePageSlug) {
    activePageSlug     = activePageSlug || '';
    const baseSlug = activePageSlug.split(/[\\/]/).slice(0, -1).join('/');
    const page_sort_meta = this.config.page_sort_meta || '';
    const category_sort  = this.config.category_sort || false;
    const files          = glob.sync(patch_content_dir(this.config.content_dir) + '**/*');
    const content_dir    = path.normalize(patch_content_dir(this.config.content_dir));
    const filesProcessed = [];

    filesProcessed.push({
      slug     : '.',
      title    : '',
      show_on_home: true,
      is_index : true,
      active: (baseSlug === ''),
      class    : 'category-index',
      sort     : 0,
      files    : []
    });

    files.forEach(filePath => {

      const shortPath = path.normalize(filePath).replace(content_dir, '').trim();
      const fileSlug = shortPath.split('\\').join('/');
      let stat      = fs.lstatSync(filePath);

      if (stat.isSymbolicLink()) {
        stat = fs.lstatSync(fs.readlinkSync(filePath));
      }

      if (stat.isDirectory()) {

        let sort = 0;
        // ignore directories that has an ignore file under it
        const ignoreFile = patch_content_dir(this.config.content_dir) + shortPath + '/ignore';

        if (fs.existsSync(ignoreFile) && fs.lstatSync(ignoreFile).isFile()) {
          return true;
        }

        let dirMetadata = {};
        try {
          const metaFile = fs.readFileSync(patch_content_dir(this.config.content_dir) + shortPath + '/meta');
          dirMetadata = contentProcessors.cleanObjectStrings(yaml.safeLoad(metaFile.toString('utf-8')));
        } catch (e) {
          if (this.config.debug) { console.log('No meta file for', patch_content_dir(this.config.content_dir) + shortPath); }
        }

        if (category_sort && !dirMetadata.sort) {
          try {
            const sortFile = fs.readFileSync(patch_content_dir(this.config.content_dir) + shortPath + '/sort');
            sort = parseInt(sortFile.toString('utf-8'), 10);
          } catch (e) {
            if (this.config.debug) { console.log('No sort file for', patch_content_dir(this.config.content_dir) + shortPath); }
          }
        }

        filesProcessed.push({
          slug     : shortPath,
          title    : dirMetadata.title || _s.titleize(_s.humanize(path.basename(shortPath))),
          show_on_home: dirMetadata.show_on_home ? (dirMetadata.show_on_home === 'true') : this.config.show_on_home_default,
          is_index : false,
          is_directory: true,
          active   : activePageSlug.startsWith('/' + fileSlug),
          class    : 'category-' + contentProcessors.cleanString(shortPath),
          sort     : dirMetadata.sort || sort,
          files    : []
        });

      }

      if (stat.isFile() && path.extname(shortPath) === '.md') {
        try {

          const file     = fs.readFileSync(filePath);
          let slug     = fileSlug;
          let pageSort = 0;

          if (fileSlug.indexOf('index.md') > -1) {
            slug = slug.replace('index.md', '');
          }

          slug = slug.replace('.md', '').trim();

          const dir  = path.dirname(shortPath);
          const meta = contentProcessors.processMeta(file.toString('utf-8'));

          if (page_sort_meta && meta[page_sort_meta]) {
            pageSort = parseInt(meta[page_sort_meta], 10);
          }

          const val = _.find(filesProcessed, item => item.slug === dir);
          val.files.push({
            slug   : slug,
            title  : meta.title ? meta.title : contentProcessors.slugToTitle(slug),
            show_on_home: meta.show_on_home ? (meta.show_on_home === 'true') : this.config.show_on_home_default,
            is_directory: false,
            active : (activePageSlug.trim() === '/' + slug),
            sort   : pageSort
          });

        } catch (e) {
          if (this.config.debug) { console.log(e); }
        }
      }
    });

    const sortedFiles = _.sortBy(filesProcessed, cat => cat.sort);
    sortedFiles.forEach(category => {
      category.files = _.sortBy(category.files, file => file.sort);
    });

    return sortedFiles;
  }

  // Index and search contents
  doSearch (query) {
    const contentDir = patch_content_dir(path.normalize(this.config.content_dir));
    const files = glob.sync(contentDir + '**/*.md');
    const idx   = lunr(function () {
      this.field('title', { boost: 10 });
      this.field('body');
    });

    files.forEach(filePath => {
      try {
        const shortPath = filePath.replace(contentDir, '').trim();
        const file      = fs.readFileSync(filePath);
        const meta      = contentProcessors.processMeta(file.toString('utf-8'));

        idx.add({
          id    : shortPath,
          title : meta.title ? meta.title : contentProcessors.slugToTitle(shortPath),
          body  : file.toString('utf-8')
        });

      } catch (e) {
        if (this.config.debug) { console.log(e); }
      }
    });

    const results       = idx.search(query);
    const searchResults = [];

    results.forEach(result => {
      const page = this.getPage(this.config.content_dir + result.ref);
      page.excerpt = page.excerpt.replace(new RegExp('(' + query + ')', 'gim'), '<span class="search-query">$1</span>');
      searchResults.push(page);
    });

    return searchResults;
  }
}

exports.default = Raneto;
module.exports = exports['default'];
