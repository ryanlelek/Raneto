
'use strict';

// Modules
var sanitize = require('sanitize-filename');

function route_page_create (config, raneto) {
  return function (req, res, next) {

    var fileCategory = '';
    if (req.body.category) {
      fileCategory   = '/' + sanitize(req.body.category);
    }
    var fileName     = '/' + sanitize(req.body.name + '.md');
    var filePath     = path.normalize(raneto.config.content_dir + fileCategory + fileName);

    fs.open(filePath, 'a', function (error, fd) {
      fs.close(fd);
      if (error) {
        return res.json({
          status  : 1,
          message : error
        });
      }
      res.json({
        status  : 0,
        message : config.lang.api.pageCreated
      });
    });

  };
}

// Exports
module.exports = route_page_create;
