
'use strict';

// Modules
var path                = require('path');
var fs                  = require('fs');
var sm                  = require('sitemap');
var _                   = require('underscore');
const contentProcessors = require('../functions/contentProcessors');
const utils             = require('../core/utils');

function route_sitemap (config) {
  return function (req, res, next) {

    var hostname = config.hostname || req.headers.host;
    var content_dir = path.normalize(config.content_dir);

    // get list md files
    var files = listFiles(content_dir);
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
      var content = fs.readFileSync(files[i], 'utf8');
      // Need to override the datetime format for sitemap
      var conf = {
        datetime_format : 'YYYY-MM-DD'
      };
      sitemap.add({
        url: (config.prefix_url || '') + urls[i],
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: utils.getLastModified(conf, contentProcessors.processMeta(content), files[i])
      });
    }

    res.header('Content-Type', 'application/xml');
    res.send(sitemap.toString());

  };
}

function listFiles (dir) {
  return fs.readdirSync(dir).reduce(function (list, file) {
    var name = path.join(dir, file);
    var isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? listFiles(name) : [name]);
  }, []);
}

// Exports
module.exports = route_sitemap;
