'use strict';

// Modules
var path                           = require('path');
var fs                             = require('fs');

// Verify and create related image folder
function dropzone_get_folder (config, slug) {

  var suffix = 'edit';

  // Remove "/edit" suffix
  if (slug.indexOf(suffix, slug.length - suffix.length) !== -1) {
    slug = slug.slice(0, -suffix.length - 1);
  }

  var img_folders = slug.split('/');
  img_folders.shift();

  // Recursively create dir
  var img_cat_folder = path.join(config.public_dir, config.image_url);
  while (img_folders.length > 0) {
    img_cat_folder = path.join(img_cat_folder, img_folders.shift());
    if (!fs.existsSync(img_cat_folder)) { fs.mkdirSync(img_cat_folder); }
  }
  return {
    folder  : img_cat_folder,
    slug    :   slug
  };

}

// Exports
module.exports = dropzone_get_folder;
