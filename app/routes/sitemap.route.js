
'use strict';

// Modules
var path                = require('path');
var fs                  = require('fs-extra');
var sm                  = require('sitemap');
var _                   = require('underscore');
const contentProcessors = require('../functions/contentProcessors');
const utils             = require('../core/utils');

function route_sitemap (config) {
  return async function (req, res, next) {

    var hostname = config.hostname || req.headers.host;
    var content_dir = path.normalize(config.content_dir);

    // get list md files
    try {
      var files = await listFiles(content_dir);

      files = _.filter(files, function (file) {
        return file.substr(-3) === '.md';
      });

      var filesPath = files.map(function (file) {
        return file.replace(content_dir, '');
      });

      // generate list urls
      var urls = filesPath.map(function (file) {
        return '/' + file.replace('.md', '').replace('\\', '/');
      });

      // create sitemap.xml
      var sitemap = sm.createSitemap({
        hostname: 'http://' + hostname,
        cacheTime: 600000
      });

      for (var i = 0, len = urls.length; i < len; i++) {
        var content = await fs.readFile(files[i], 'utf8');
        // Need to override the datetime format for sitemap
        var conf = {
          datetime_format : 'YYYY-MM-DD'
        };
        sitemap.add({
          url: (config.prefix_url || '') + urls[i],
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: await utils.getLastModified(conf, contentProcessors.processMeta(content), files[i])
        });
      }

      res.header('Content-Type', 'application/xml');
      res.send(sitemap.toString());
    } catch (error) {
      next(error);
    }
  };
}

async function listFiles (dir) {
  const entries = await fs.readdir(dir);

  // Build an array of arrays with all sub-files
  const paths = await Promise.all(
    entries.map(async entry => {
      const filePath = path.join(dir, entry);
      const isDir = (await fs.stat(filePath)).isDirectory();
      return isDir ? listFiles(filePath) : [filePath];
    })
  );

  // Return the flattened array
  return paths.reduce((list, paths) => list.concat(paths), []);
}

// Exports
module.exports = route_sitemap;
