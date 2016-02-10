
'use strict';

// Modules
var fs                             = require('fs');
var moment                         = require('moment');
var get_filepath                   = require('../functions/get_filepath.js');
var remove_image_content_directory = require('../functions/remove_image_content_directory.js');

function route_home (config, raneto) {
  return function (req, res, next) {

    // Generate Filepath
    var filepath = get_filepath({
      content  : raneto.config.content_dir,
      filename : 'index'
    });

    // Do we have an index.md file?
    // If so, use that.
    if (fs.existsSync(filepath + '.md')) {
      return next();
    }

    // Otherwise, we're generating the home page listing
    var suffix = 'edit';
    if (filepath.indexOf(suffix, filepath.length - suffix.length) !== -1) {
      filepath = filepath.slice(0, - suffix.length - 1);
    }

    var template_filepath = get_filepath({
      content  : [config.theme_dir, config.theme_name, 'templates'].join('/'),
      filename : 'home.html'
    });

    var stat     = fs.lstatSync(template_filepath);
    var pageList = remove_image_content_directory(config, raneto.getPages('/index'));

    return res.render('home', {
      config        : config,
      pages         : pageList,
      body_class    : 'page-home',
      meta          : config.home_meta,
      last_modified : moment(stat.mtime).format('Do MMM YYYY'),
      lang          : config.lang,
      loggedIn      : (config.authentication ? req.session.loggedIn : false)
    });

  };
}

// Exports
module.exports = route_home;
