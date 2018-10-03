
'use strict';

// Modules
var path     = require('path');
var sanitize = require('sanitize-filename');

function get_filepath (p) {

  // Default
  var filepath = p.content;

  // Add Categories
  if (p.category) {
    if(!Array.isArray(p.category)){
      p.category = [p.category];
    }
    p.category.forEach(function(cat) {
      filepath = path.join(filepath, sanitize(cat));
    });
    
  }

  // Add File Name
  if (p.filename) {
    filepath = path.join(filepath, sanitize(p.filename));
  }

  // Normalize
  filepath = path.normalize(filepath);
  
  return filepath;

}

// Exports
module.exports = get_filepath;
