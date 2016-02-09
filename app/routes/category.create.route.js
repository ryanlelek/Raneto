
'use strict';

// Modules
var path     = require('path');
var fs       = require('fs');
var sanitize = require('sanitize-filename');

function route_category_create (config, raneto) {
  return function (req, res, next) {

    var fileCategory = '/' + sanitize(req.body.category);
    var filePath     = path.normalize(raneto.config.content_dir + fileCategory);
    fs.mkdir(filePath, function (error) {
      if (error) {
        return res.json({
          status  : 1,
          message : error
        });
      }
      res.json({
        status  : 0,
        message : config.lang.api.categoryCreated
      });
    });

  };
}

// Exports
module.exports = route_category_create;
