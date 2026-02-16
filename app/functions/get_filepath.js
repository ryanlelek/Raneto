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

  // Ensure resolved path is strictly inside the content directory
  const resolved = path.resolve(filepath);
  const contentRoot = path.resolve(p.content);
  if (!resolved.startsWith(contentRoot + path.sep)) {
    return null;
  }

  return filepath;
}

// Exports
export default get_filepath;
