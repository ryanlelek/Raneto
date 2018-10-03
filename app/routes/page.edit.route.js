
'use strict';

// Modules
var fs               = require('fs');
var get_filepath     = require('../functions/get_filepath.js');
var create_meta_info = require('../functions/create_meta_info.js');

function route_page_edit (config) {
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

    // Create content including meta information (i.e. title, description, sort)
    function create_content (body) {
      var meta = create_meta_info(body.meta_title, body.meta_description, body.meta_sort);
      return meta + body.content;
    }

    var complete_content = create_content(req.body);

    fs.writeFile(filepath, complete_content, function (error) {
      if (error) {
        return res.json({
          status  : 1,
          message : error
        });
      }
      res.json({
        status  : 0,
        message : config.lang.api.pageSaved
      });
    });

  };
}

// Exports
module.exports = route_page_edit;
