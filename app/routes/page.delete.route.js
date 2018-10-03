
'use strict';

// Modules
var fs           = require('fs');
var get_filepath = require('../functions/get_filepath.js');

function route_page_delete (config) {
  return function (req, res, next) {

    var file_category;
    var file_name;
    
    // Handle category in file path
    var req_file = req.body.file.split('/');
    // Suppress first empty
    req_file.shift();
    file_name = req_file.pop();
    
    if (req_file.length > 0) {
      file_category = req_file;
    }

    // Generate Filepath
    var filepath = get_filepath({
      content  : config.content_dir,
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
