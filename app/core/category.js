'use strict';

const path = require('path');

function handler (pages, slug) {
  let i = pages.length;
  let is_exact = false;
  let currentPage = null;

  // remove trailing slashes (match both for Windows and Unix)
  slug = path.normalize(slug).replace(/^\\|^\/|\/$|\\$/g, '');

  while (i--) {
    const page = pages[i];
    const _slug = path.normalize(page.slug);

    is_exact = _slug === slug;

    if (is_exact || slug.indexOf(_slug) === 0) {
      currentPage = page;
      break;
    }
  }

  if (currentPage && currentPage.files && !is_exact) {
    return handler(currentPage.files, slug);
  }

  return currentPage;
}

exports.default = handler;
module.exports = exports.default;
