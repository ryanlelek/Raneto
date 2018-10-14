
'use strict';

// Modules
var fs                             = require('fs-extra');
var _                              = require('underscore');
var build_nested_pages             = require('../functions/build_nested_pages.js');
var get_filepath                   = require('../functions/get_filepath.js');
var remove_image_content_directory = require('../functions/remove_image_content_directory.js');

const contentsHandler = require('../core/contents');
const utils = require('../core/utils');

function route_home (config) {
  return async function (req, res, next) {

    // Generate Filepath
    var filepath = get_filepath({
      content  : config.content_dir,
      filename : 'index'
    });

    // Do we have an index.md file?
    // If so, use that.
    if (await fs.pathExists(filepath + '.md')) {
      return next();
    }

    // Otherwise, we're generating the home page listing
    var suffix = 'edit';
    if (filepath.indexOf(suffix, filepath.length - suffix.length) !== -1) {
      filepath = filepath.slice(0, -suffix.length - 1);
    }

    var template_filepath = get_filepath({
      content  : [config.theme_dir, config.theme_name, 'templates'].join('/'),
      filename : 'home.html'
    });

    // Filter out the image content directory and items with show_on_home == false
    var pageList = remove_image_content_directory(config,
      _.chain(await contentsHandler('/index', config))
        .filter(function (page) { return page.show_on_home; })
        .map(function (page) {
          page.files = _.filter(page.files, function (file) { return file.show_on_home; });
          return page;
        })
        .value());

    return res.render('home', {
      config        : config,
      pages         : build_nested_pages(pageList),
      body_class    : 'page-home',
      meta          : config.home_meta,
      last_modified : await utils.getLastModified(config, config.home_meta, template_filepath),
      lang          : config.lang,
      loggedIn      : ((config.authentication || config.authentication_for_edit) ? req.session.loggedIn : false),
      username      : ((config.authentication || config.authentication_for_edit) ? req.session.username : null)
    });

  };
}

// Exports
module.exports = route_home;
