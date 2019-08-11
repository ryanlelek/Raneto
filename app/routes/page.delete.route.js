
'use strict';

// Modules
var fs           = require('fs-extra');
var get_filepath = require('../functions/get_filepath.js');

function route_page_delete (config) {
  return async function (req, res, next) {

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
      content  : config.content_dir,
      category : file_category,
      filename : file_name
    });

    // No file at that filepath?
    // Add ".md" extension to try again
    if (!(await fs.pathExists(filepath))) {
      filepath += '.md';
    }

    try {
      // Don't Delete
      // Rename to remove from listing
      await fs.rename(filepath, filepath + '.del');

      res.json({
        status  : 0,
        message : config.lang.api.pageDeleted
      });
    } catch (error) {
      res.json({
        status  : 1,
        message : error
      });
    }
  };
}

// Exports
module.exports = route_page_delete;
