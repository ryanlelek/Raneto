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

  // Resolve the candidate path and collapse symlinks
  const resolved = path.resolve(file_path);
  const realPath = await fs.realpath(resolved);

  // Verify the real path is contained within an allowed root
  if (
    !allowedRoots.some(
      (root) => realPath.startsWith(root + path.sep) || realPath === root,
    )
  ) {
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
