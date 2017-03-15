'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _glob = require('glob');

var glob = _interopRequireWildcard(_glob);

var _underscore = require('underscore');

var _ = _interopRequireWildcard(_underscore);

var _underscore2 = require('underscore.string');

var _s = _interopRequireWildcard(_underscore2);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _lunr = require('lunr');

var _lunr2 = _interopRequireDefault(_lunr);

var _jsYaml = require('js-yaml');

var yaml = _interopRequireWildcard(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var default_config = {
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
  // Specify the path of your content folder where all your '.md' files are located
  content_dir: './content/',
  // Toggle debug logging
  debug: false
};

// Regex for page meta (considers Byte Order Mark \uFEFF in case there's one)
// Look for the the following header formats at the beginning of the file:
// /*
// {header string}
// */
//   or
// ---
// {header string}
// ---
var _metaRegex = /^\uFEFF?\/\*([\s\S]*?)\*\//i;
var _metaRegexYaml = /^\uFEFF?---([\s\S]*?)---/i;

function patch_content_dir(content_dir) {
  return content_dir.replace(/\\/g, '/');
}

var Raneto = function () {
  function Raneto() {
    _classCallCheck(this, Raneto);

    this.config = _extends({}, default_config); // Clone default config
  }

  // Makes filename safe strings


  _createClass(Raneto, [{
    key: 'cleanString',
    value: function cleanString(str, use_underscore) {
      var u = use_underscore || false;
      str = str.replace(/\//g, ' ').trim();
      if (u) {
        return _s.underscored(str);
      } else {
        return _s.trim(_s.dasherize(str), '-');
      }
    }

    // Clean object strings.

  }, {
    key: 'cleanObjectStrings',
    value: function cleanObjectStrings(obj) {
      var cleanObj = {};
      for (var field in obj) {
        if (obj.hasOwnProperty(field)) {
          cleanObj[this.cleanString(field, true)] = ('' + obj[field]).trim();
        }
      }
      return cleanObj;
    }

    // Convert a slug to a title

  }, {
    key: 'slugToTitle',
    value: function slugToTitle(slug) {
      slug = slug.replace('.md', '').trim();
      return _s.titleize(_s.humanize(path.basename(slug)));
    }

    // Get meta information from Markdown content

  }, {
    key: 'processMeta',
    value: function processMeta(markdownContent) {
      var _this = this;

      var meta = {};
      var metaArr = void 0;
      var metaString = void 0;
      var metas = void 0;

      var yamlObject = void 0;

      switch (true) {
        case _metaRegex.test(markdownContent):
          metaArr = markdownContent.match(_metaRegex);
          metaString = metaArr ? metaArr[1].trim() : '';

          if (metaString) {
            metas = metaString.match(/(.*): (.*)/ig);
            metas.forEach(function (item) {
              var parts = item.split(': ');
              if (parts[0] && parts[1]) {
                meta[_this.cleanString(parts[0], true)] = parts[1].trim();
              }
            });
          }
          break;

        case _metaRegexYaml.test(markdownContent):
          metaArr = markdownContent.match(_metaRegexYaml);
          metaString = metaArr ? metaArr[1].trim() : '';
          yamlObject = yaml.safeLoad(metaString);
          meta = this.cleanObjectStrings(yamlObject);
          break;

        default:
        // No meta information
      }

      return meta;
    }

    // Strip meta from Markdown content

  }, {
    key: 'stripMeta',
    value: function stripMeta(markdownContent) {
      switch (true) {
        case _metaRegex.test(markdownContent):
          return markdownContent.replace(_metaRegex, '').trim();
        case _metaRegexYaml.test(markdownContent):
          return markdownContent.replace(_metaRegexYaml, '').trim();
        default:
          return markdownContent.trim();
      }
    }

    // Replace content variables in Markdown content

  }, {
    key: 'processVars',
    value: function processVars(markdownContent) {
      if (typeof this.config.variables !== 'undefined') {
        this.config.variables.forEach(function (block) {
          markdownContent = markdownContent.replace(new RegExp('\%' + block.name + '\%', 'g'), block.content);
        });
      }
      if (typeof this.config.base_url !== 'undefined') {
        markdownContent = markdownContent.replace(/\%base_url\%/g, this.config.base_url);
      }
      if (typeof this.config.image_url !== 'undefined') {
        markdownContent = markdownContent.replace(/\%image_url\%/g, this.config.image_url);
      }
      return markdownContent;
    }

    // Get a page

  }, {
    key: 'getPage',
    value: function getPage(filePath) {
      try {
        var file = fs.readFileSync(filePath);
        var slug = patch_content_dir(filePath).replace(patch_content_dir(this.config.content_dir), '').trim();

        if (slug.indexOf('index.md') > -1) {
          slug = slug.replace('index.md', '');
        }
        slug = slug.replace('.md', '').trim();

        var meta = this.processMeta(file.toString('utf-8'));
        var content = this.stripMeta(file.toString('utf-8'));
        content = this.processVars(content);
        var html = (0, _marked2.default)(content);

        return {
          slug: slug,
          title: meta.title ? meta.title : this.slugToTitle(slug),
          body: html,
          excerpt: _s.prune(_s.stripTags(_s.unescapeHTML(html)), this.config.excerpt_length || 400)
        };
      } catch (e) {
        if (this.config.debug) {
          console.log(e);
        }
        return null;
      }
    }

    // Get a structured array of the contents of contentDir

  }, {
    key: 'getPages',
    value: function getPages(activePageSlug) {
      var _this2 = this;

      activePageSlug = activePageSlug || '';
      var page_sort_meta = this.config.page_sort_meta || '';
      var category_sort = this.config.category_sort || false;
      var files = glob.sync(patch_content_dir(this.config.content_dir) + '**/*');
      var content_dir = path.normalize(patch_content_dir(this.config.content_dir));
      var filesProcessed = [];

      filesProcessed.push({
        slug: '.',
        title: '',
        is_index: true,
        class: 'category-index',
        sort: 0,
        files: []
      });

      files.forEach(function (filePath) {

        var shortPath = path.normalize(filePath).replace(content_dir, '').trim();
        var stat = fs.lstatSync(filePath);

        if (stat.isSymbolicLink()) {
          stat = fs.lstatSync(fs.readlinkSync(filePath));
        }

        if (stat.isDirectory()) {

          var sort = 0;
          // ignore directories that has an ignore file under it
          var ignoreFile = patch_content_dir(_this2.config.content_dir) + shortPath + '/ignore';

          if (fs.existsSync(ignoreFile) && fs.lstatSync(ignoreFile).isFile()) {
            return true;
          }

          var dirMetadata = {};
          try {
            var metaFile = fs.readFileSync(patch_content_dir(_this2.config.content_dir) + shortPath + '/meta');
            dirMetadata = _this2.cleanObjectStrings(yaml.safeLoad(metaFile.toString('utf-8')));
          } catch (e) {
            if (_this2.config.debug) {
              console.log('No meta file for', patch_content_dir(_this2.config.content_dir) + shortPath);
            }
          }

          if (category_sort && !dirMetadata.sort) {
            try {
              var sortFile = fs.readFileSync(patch_content_dir(_this2.config.content_dir) + shortPath + '/sort');
              sort = parseInt(sortFile.toString('utf-8'), 10);
            } catch (e) {
              if (_this2.config.debug) {
                console.log('No sort file for', patch_content_dir(_this2.config.content_dir) + shortPath);
              }
            }
          }

          filesProcessed.push({
            slug: shortPath,
            title: dirMetadata.title || _s.titleize(_s.humanize(path.basename(shortPath))),
            is_index: false,
            is_directory: true,
            class: 'category-' + _this2.cleanString(shortPath),
            sort: dirMetadata.sort || sort,
            files: []
          });
        }

        if (stat.isFile() && path.extname(shortPath) === '.md') {
          try {

            var file = fs.readFileSync(filePath);
            var slug = shortPath;
            var pageSort = 0;

            if (shortPath.indexOf('index.md') > -1) {
              slug = slug.replace('index.md', '');
            }

            slug = slug.replace('.md', '').trim();

            var dir = path.dirname(shortPath);
            var meta = _this2.processMeta(file.toString('utf-8'));

            if (page_sort_meta && meta[page_sort_meta]) {
              pageSort = parseInt(meta[page_sort_meta], 10);
            }

            var val = _.find(filesProcessed, function (item) {
              return item.slug === dir;
            });
            val.files.push({
              slug: slug,
              title: meta.title ? meta.title : _this2.slugToTitle(slug),
              is_directory: false,
              active: activePageSlug.trim() === '/' + slug,
              sort: pageSort
            });
          } catch (e) {
            if (_this2.config.debug) {
              console.log(e);
            }
          }
        }
      });

      var sortedFiles = _.sortBy(filesProcessed, function (cat) {
        return cat.sort;
      });
      sortedFiles.forEach(function (category) {
        category.files = _.sortBy(category.files, function (file) {
          return file.sort;
        });
      });

      return sortedFiles;
    }

    // Index and search contents

  }, {
    key: 'doSearch',
    value: function doSearch(query) {
      var _this3 = this;

      var contentDir = patch_content_dir(path.normalize(this.config.content_dir));
      var files = glob.sync(contentDir + '**/*.md');
      var idx = (0, _lunr2.default)(function () {
        this.field('title', { boost: 10 });
        this.field('body');
      });

      files.forEach(function (filePath) {
        try {
          var shortPath = filePath.replace(contentDir, '').trim();
          var file = fs.readFileSync(filePath);
          var meta = _this3.processMeta(file.toString('utf-8'));

          idx.add({
            id: shortPath,
            title: meta.title ? meta.title : _this3.slugToTitle(shortPath),
            body: file.toString('utf-8')
          });
        } catch (e) {
          if (_this3.config.debug) {
            console.log(e);
          }
        }
      });

      var results = idx.search(query);
      var searchResults = [];

      results.forEach(function (result) {
        var page = _this3.getPage(_this3.config.content_dir + result.ref);
        page.excerpt = page.excerpt.replace(new RegExp('(' + query + ')', 'gim'), '<span class="search-query">$1</span>');
        searchResults.push(page);
      });

      return searchResults;
    }
  }]);

  return Raneto;
}();

exports.default = new Raneto();
module.exports = exports['default'];