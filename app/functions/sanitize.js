// Modules
import validator from 'validator';

// Settings
const invalidChars = '&\'"/><';

// TODO: Add Test
function sanitizer(str) {
  str = validator.blacklist(str, invalidChars);
  str = validator.trim(str);
  str = validator.escape(str);
  return str;
}

// Exports
export default sanitizer;
