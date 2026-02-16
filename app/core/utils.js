// Modules
import path from 'node:path';
import fs from 'fs-extra';
import moment from 'moment';

const normalizeDir = (dir) => dir.replace(/\\/g, '/');
const getSlug = (filePath, contentDir) =>
  normalizeDir(filePath).replace(normalizeDir(contentDir), '').trim();

async function getLastModified(config, meta, file_path) {
  if (typeof meta.modified !== 'undefined') {
    return moment(meta.modified).format(config.datetime_format);
  }

  // Normalize path against allowed root directories and resolve symlinks
  const contentRoot = path.resolve(config.content_dir);
  const allowedRoots = [contentRoot];
  if (config.theme_dir) {
    allowedRoots.push(path.resolve(config.theme_dir));
  }

  const isWithinAllowed = (p) =>
    allowedRoots.some(
      (root) => p.startsWith(root + path.sep) || p === root,
    );

  // Validate resolved path before any filesystem operations
  const resolved = path.resolve(file_path);
  if (!isWithinAllowed(resolved)) {
    throw new Error('Access denied: file path is outside allowed directories');
  }

  // Resolve symlinks and re-validate the real path
  const realPath = await fs.realpath(resolved);
  if (!isWithinAllowed(realPath)) {
    throw new Error('Access denied: file path is outside allowed directories');
  }

  const { mtime } = await fs.lstat(realPath);
  return moment(mtime).format(config.datetime_format);
}

export default {
  normalizeDir,
  getLastModified,
  getSlug,
};
