
'use strict';

// Modules
var fs           = require('fs');
var get_filepath = require('../functions/get_filepath.js');

function route_category_create (config) {
  return function (req, res, next) {

    fs.mkdir(get_filepath({
      content  : config.content_dir,
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
