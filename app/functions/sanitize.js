// Modules
import validator from 'validator';

// NOTE: This function is for HTML sanitization only.
// It does NOT neutralize path traversal sequences (e.g. "..") — path security
// is enforced separately in getFilepath.js via explicit part rejection and
// the authoritative path.resolve + startsWith content-root check.

// Settings
const invalidChars = '&\'"/><';

function sanitizer(str) {
  str = validator.blacklist(str, invalidChars);
  str = validator.trim(str);
  str = validator.escape(str);
  return str;
}

// Exports
export default sanitizer;
