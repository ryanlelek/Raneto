
'use strict';

// Modules
var path                           = require('path');
var fs                             = require('fs');
var os                             = require('os');
var multer                         = require('multer');
var dropzone_get_folder            = require('../functions/dropzone_get_folder.js');
var upload                         = multer({ dest: os.tmpdir() }).array('file', 10);

function route_post_dropzone (config) {
  return function (req, res, next) {

    var slug   = req.query.slug;
    var cat_img = dropzone_get_folder(config, slug);

    // Get files rrom multer
    upload(req, res, function (error) {
      if (error) {
        return res.json({
          status  : 1,
          message : error
        });
      }

      var uploadedFile = req.files.pop();
      var destination = path.join(cat_img.folder, uploadedFile.originalname);
      // Rename file
      fs.rename(uploadedFile.path, destination,
        function (error, data) {
          if (error) {
            if (error.code === 'EXDEV') {
              var readStream = fs.createReadStream(uploadedFile.path);
              var writeStream = fs.createWriteStream(destination);
              readStream.pipe(writeStream);
              readStream.on('end', function () {
                fs.unlinkSync(uploadedFile.path);
              });
            } else {
              return res.json({
                status  : 1,
                message : error
              });
            }
          }
          res.send(path.join(config.image_url, cat_img.slug, uploadedFile.originalname));
        });
    });
  };
}
// Exports
module.exports = route_post_dropzone;
