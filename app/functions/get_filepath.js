
'use strict';

// Modules
var path     = require('path');
var sanitize = require('sanitize-filename');

function get_filepath (p) {

  // Default
  var filepath = p.content;

  // Add Category
  if (p.category) {
    filepath += '/' + sanitize(p.category);
  }

  // Add File Name
  if (p.filename) {
    filepath += '/' + sanitize(p.filename);
  }

  // Normalize
  filepath = path.normalize(filepath);

  return filepath;

}

// Exports
module.exports = get_filepath;
