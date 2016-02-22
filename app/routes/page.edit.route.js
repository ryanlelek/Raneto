
'use strict';

// Modules
var fs           = require('fs');
var get_filepath = require('../functions/get_filepath.js');

function route_page_edit (config, raneto) {
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

    // Create content including meta information (i.e. title, description, sort)
    function create_content(body) {

      function create_meta_info(meta_title, meta_description, meta_sort) {
        var newline = '\n';
        var comment_start = '/*';
        var comment_end = '*/';
        var title_label = 'Title: ';
        var description_label = 'Description: ';
        var description_sort = 'Sort: ';

        var no_meta_info_is_present = !meta_title && !meta_description && !meta_sort;
        var meta_header = '';
        if (!no_meta_info_is_present) {
          meta_header = comment_start + newline +
            (meta_title ? title_label + meta_title + newline : '') +
            (meta_description ? description_label + meta_description + newline : '') +
            (meta_sort ? description_sort + meta_sort + newline : '') +
            comment_end + newline + newline;
        }

        return meta_header;
      }
    
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
