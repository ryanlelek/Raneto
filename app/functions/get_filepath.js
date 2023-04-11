// Modules
var path = require('path');
var sanitizeFilename = require('sanitize-filename');
var sanitize = require('./sanitize.js');

function get_filepath(p) {
  // Default
  var filepath = p.content;

  // Add Category
  if (p.category) {
    filepath += `/${sanitizeFilename(sanitize(p.category))}`;
  }

  // Add File Name
  if (p.filename) {
    filepath += `/${sanitizeFilename(sanitize(p.filename))}`;
  }

  // Normalize
  filepath = path.normalize(filepath);

  return filepath;
}

// Exports
module.exports = get_filepath;
