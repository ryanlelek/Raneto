// Modules
import fs from 'fs-extra';
import moment from 'moment';

const normalizeDir = (dir) => dir.replace(/\\/g, '/');
const getSlug = (filePath, contentDir) =>
  normalizeDir(filePath).replace(normalizeDir(contentDir), '').trim();

async function getLastModified(config, meta, file_path) {
  if (typeof meta.modified !== 'undefined') {
    return moment(meta.modified).format(config.datetime_format);
  }
  const { mtime } = await fs.lstat(file_path);
  return moment(mtime).format(config.datetime_format);
}

export default {
  normalizeDir,
  getLastModified,
  getSlug,
};
