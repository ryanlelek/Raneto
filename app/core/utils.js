
'use strict';

const fs     = require('fs');
const moment = require('moment');

const normalizeDir = (dir) => dir.replace(/\\/g, '/');
const getSlug      = (filePath, contentDir) => normalizeDir(filePath).replace(normalizeDir(contentDir), '').trim();

function getLastModified (config, meta, file_path) {
  if (typeof meta.modified !== 'undefined') {
    return moment(meta.modified).format(config.datetime_format);
  } else {
    return moment(fs.lstatSync(file_path).mtime).format(config.datetime_format);
  }
}

exports.default = {
  normalizeDir,
  getLastModified,
  getSlug
};

module.exports = exports.default;
