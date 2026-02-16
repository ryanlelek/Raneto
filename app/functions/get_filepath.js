// Modules
import path from 'node:path';
import fs from 'fs-extra';
import sanitizeFilename from 'sanitize-filename';
import sanitize from './sanitize.js';

function getFilepath(p) {
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

async function resolveFilepath(filepath) {
  if (await fs.pathExists(filepath)) {
    return filepath;
  }
  return `${filepath}.md`;
}

function parseFileParam(fileParam) {
  if (!fileParam || fileParam.trim() === '') {
    return null;
  }
  const parts = fileParam.split('/');
  if (parts.length > 1) {
    return { category: parts[0], filename: parts[1] };
  }
  return { category: '', filename: parts[0] };
}

// Exports
export default getFilepath;
export { resolveFilepath, parseFileParam };
