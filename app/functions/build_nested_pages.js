'use strict';

function build_nested_pages (pages) {
  var result = [];
  var i = pages.length;

  while(i--) {
    if (pages[i].slug.split('/').length > 1) {
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
    return element.slug === page.slug.split('/').slice(0, -1).join('/');
  });
}

// Exports
module.exports = build_nested_pages;
