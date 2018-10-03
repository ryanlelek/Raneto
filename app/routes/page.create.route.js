
'use strict';

// Modules
var fs           = require('fs');
var get_filepath = require('../functions/get_filepath.js');

function route_page_create (config) {
  return function (req, res, next) {

    // Handle category in file path
    var req_file = req.body.name.split('/');
    var file_name = req_file.pop() + '.md';
    var req_category = [req.body.category].concat(req_file);

    var filepath = get_filepath({
      content  : config.content_dir,
      category : req_category,
      filename : file_name
    });

    fs.open(filepath, 'a', function (error, fd) {
      if (error) {
        return res.json({
          status  : 1,
          message : error
        });
      }
      fs.close(fd, function (error) {
        if (error) {
          return res.json({
            status  : 1,
            message : error
          });
        }
      });
      res.json({
        status  : 0,
        message : config.lang.api.pageCreated
      });
    });

  };
}

// Exports
module.exports = route_page_create;
