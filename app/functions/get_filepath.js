// Modules
import path from 'node:path';
import sanitizeFilename from 'sanitize-filename';
import sanitize from './sanitize.js';

function get_filepath(p) {
  // Default
  let filepath = p.content;

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
export default get_filepath;
