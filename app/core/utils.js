
'use strict';

const glob   = require('glob');
const fs     = require('fs-extra');
const util   = require('util');
const moment = require('moment');

const promiseGlob = util.promisify(glob);

const normalizeDir = (dir) => dir.replace(/\\/g, '/');
const getSlug      = (filePath, contentDir) => normalizeDir(filePath).replace(normalizeDir(contentDir), '').trim();

async function getLastModified (config, meta, file_path) {
  if (typeof meta.modified !== 'undefined') {
    return moment(meta.modified).format(config.datetime_format);
  } else {
    const { mtime } = await fs.lstat(file_path);
    return moment(mtime).format(config.datetime_format);
  }
}

exports.default = {
  normalizeDir,
  getLastModified,
  getSlug,
  promiseGlob
};

module.exports = exports.default;
