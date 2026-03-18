// Modules
import path from 'node:path';
import fs from 'fs-extra';
import sanitizeFilename from 'sanitize-filename';
import sanitize from './sanitize.js';

function getFilepath(p) {
  // Default
  let filepath = p.content;

  // Add Category - support multi-level paths (e.g. 'projects/Tasks')
  if (p.category) {
    for (const part of p.category.split('/')) {
      const clean = sanitizeFilename(sanitize(part));
      // Reject traversal sequences and empty parts (defense-in-depth ahead of
      // the path.resolve check below, which is the authoritative guard)
      if (!clean || clean === '.' || clean === '..') {
        return null;
      }
      filepath += `/${clean}`;
    }
  }

  // Add File Name
  if (p.filename) {
    filepath += `/${sanitizeFilename(sanitize(p.filename))}`;
  }

  // Normalize
  filepath = path.normalize(filepath);

  // Authoritative path traversal guard — resolved path must be strictly inside
  // the content directory regardless of what sanitization passed through
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
  const parts = fileParam.split('/').filter((p) => p.length > 0);
  if (parts.length === 0) {
    return null;
  }
  if (parts.length > 1) {
    return {
      category: parts.slice(0, -1).join('/'),
      filename: parts[parts.length - 1],
    };
  }
  return { category: '', filename: parts[0] };
}

// Exports
export default getFilepath;
export { resolveFilepath, parseFileParam };
