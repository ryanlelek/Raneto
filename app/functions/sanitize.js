// Modules
var validator = require('validator');

// Settings
var invalidChars = '&\'"/><';

// TODO: Add Test
function sanitizer(str) {
  str = validator.blacklist(str, invalidChars);
  str = validator.trim(str);
  str = validator.escape(str);
  return str;
}

// Exports
module.exports = exports = sanitizer;
