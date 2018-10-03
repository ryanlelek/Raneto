
'use strict';

// Modules
var path                           = require('path');
var fs                             = require('fs');
var dropzone_get_folder            = require('../functions/dropzone_get_folder.js');

function route_get_dropzone (config) {
  return function (req, res, next) {

    var slug   = req.query.slug;
    var cat_img = dropzone_get_folder(config, slug);

    fs.readdir(cat_img.folder, function (error, dirFiles) {
      if (error) {
        return res.json({
          status  : 1,
          message : error
        });
      }
      var files = [];
      for (var i = 0; i < dirFiles.length; i++) {
        var fileName = dirFiles[i];
        var filePath = path.join(cat_img.folder, fileName);
        var stats = fs.statSync(filePath);

        if (stats.isFile()) {
          files.push({
            name    :   fileName,
            size    :   stats.size,
            type    :   'image/jpeg',
            url     :   path.join(config.image_url, cat_img.slug, fileName)
          });
        }
      }
      res.send({files: files});
    });
  };
}
// Exports
module.exports = route_get_dropzone;
