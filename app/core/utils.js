'use strict';

const normalizeDir = (dir) => dir.replace(/\\/g, '/');
const getSlug = (filePath, contentDir) => normalizeDir(filePath).replace(normalizeDir(contentDir), '').trim();

exports.default = {
  normalizeDir,
  getSlug
};

module.exports = exports.default;
