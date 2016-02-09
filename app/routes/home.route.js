
'use strict';

// Modules
var path                           = require('path');
var fs                             = require('fs');
var moment                         = require('moment');
var remove_image_content_directory = require('../functions/remove_image_content_directory.js');

function route_home (config, raneto) {
  return function (req, res, next) {

    var suffix = 'edit';
    var slug = '/index';

    var pageList     = remove_image_content_directory(config, raneto.getPages(slug));
    var filePath     = path.normalize(raneto.config.content_dir + slug);

    if (fs.existsSync(filePath + '.md')) {
      return next();
    }

    if (filePath.indexOf(suffix, filePath.length - suffix.length) !== -1) {
      filePath = filePath.slice(0, - suffix.length - 1);
    }

    var stat = fs.lstatSync(path.join(config.theme_dir, config.theme_name, 'templates', 'home.html'));

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
