
'use strict';

// Modules
var path     = require('path');
var fs       = require('fs');
var sanitize = require('sanitize-filename');

function route_page_delete (config, raneto) {
  return function (req, res, next) {

    var req_file     = req.body.file.split('/');
    var fileCategory = '';
    var fileName     = '/' + sanitize(req_file[1]);
    if (req_file.length > 2) {
      fileCategory   = '/' + sanitize(req_file[1]);
      fileName       = '/' + sanitize(req_file[2]);
    }
    var filePath     = path.normalize(raneto.config.content_dir + fileCategory + fileName);
    if (!fs.existsSync(filePath)) { filePath += '.md'; }

    fs.rename(filePath, filePath + '.del', function (error) {
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
