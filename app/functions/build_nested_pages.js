
'use strict';

var path = require('path');

function build_nested_pages (pages) {
  var result = [];
  var i = pages.length;

  while (i--) {
    if (pages[i].slug.split(path.sep).length > 1) {
      var parent = find_by_slug(pages, pages[i]);
      parent.files.unshift(pages[i]);
    } else {
      result.unshift(pages[i]);
    }
  }

  return result;
}

function find_by_slug (pages, page) {
  return pages.find(function (element) {
    return element.slug === page.slug.split(path.sep).slice(0, -1).join(path.sep);
  });
}

// Exports
module.exports = build_nested_pages;
