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

  // Validate file_path is within an allowed directory
  const resolved = path.resolve(file_path);
  const allowedDirs = [path.resolve(config.content_dir)];
  if (config.theme_dir) {
    allowedDirs.push(path.resolve(config.theme_dir));
  }
  if (
    !allowedDirs.some(
      (dir) => resolved.startsWith(dir + path.sep) || resolved === dir,
    )
  ) {
    throw new Error('Access denied: file path is outside allowed directories');
  }

  const { mtime } = await fs.lstat(resolved);
  return moment(mtime).format(config.datetime_format);
}

export default {
  normalizeDir,
  getLastModified,
  getSlug,
};
