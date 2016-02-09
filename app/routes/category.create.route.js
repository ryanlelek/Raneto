
'use strict';

// Modules
var fs           = require('fs');
var get_filepath = require('../functions/get_filepath.js');

function route_category_create (config, raneto) {
  return function (req, res, next) {

    fs.mkdir(get_filepath({
      content  : raneto.config.content_dir,
      category : req.body.category
    }), function (error) {
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
