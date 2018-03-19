
'use strict';

// Modules
var path     = require('path');
var sanitize = require('sanitize-filename');

function get_filepath (p, req) {
  var language = 'en';
  console.log(p.content);
  try {
    console.log("GOOD COOKIES: " + req.cookies['language']);
    language = req.cookies['language'];
  } catch(err) {
    console.log("BAD COOKIES");
    console.log(err);
  }
  
  // Default
  var filepath = p.content;

  // Add Category
  if (p.category) {
    filepath += '/' + sanitize(p.category);
  }

  // Add File Name
  if (p.filename) {
    try {
      if(p.content.indexOf('content') > -1){
        var selectedLanguage = "content-" + language
        console.log(selectedLanguage)
        filepath = filepath.replace('content', selectedLanguage);
        console.log('New file path: ' + filepath);
      }
    } catch(err) {
      console.log("Not the right link")
    }
    filepath += '/' + sanitize(p.filename);
  }

  // Normalize
  filepath = path.normalize(filepath);

  console.log("Final file path: " + filepath);
  return filepath;

}

// Exports
module.exports = get_filepath;
