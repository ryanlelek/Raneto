
'use strict';

// Modules
var fs           = require('fs');
var get_filepath = require('../functions/get_filepath.js');

function route_page_delete (config, raneto) {
  return function (req, res, next) {

    var file_category;
    var file_name;

    // Handle category in file path
    var req_file = req.body.file.split('/');
    if (req_file.length > 2) {
      file_category = req_file[1];
      file_name     = req_file[2];
    } else {
      file_name     = req_file[1];
    }

    // Generate Filepath
    var filepath = get_filepath({
      content  : raneto.config.content_dir,
      category : file_category,
      filename : file_name
    });

    // No file at that filepath?
    // Add ".md" extension to try again
    if (!fs.existsSync(filepath)) {
      filepath += '.md';
    }

    // Don't Delete
    // Rename to remove from listing
    fs.rename(filepath, filepath + '.del', function (error) {
      if (error) {
        return res.json({
          status  : 1,
          message : error
        });
      }
      res.json({
        status  : 0,
        message : config.lang.api.pageDeleted
      });
    });

  };
}

// Exports
module.exports = route_page_delete;
