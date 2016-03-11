
'use strict';

// Returns an empty string if all input strings are empty
function create_meta_info(meta_title, meta_description, meta_sort) {
  var newline = '\n';
  var comment_start = '/*';
  var comment_end = '*/';
  var title_label = 'Title: ';
  var description_label = 'Description: ';
  var description_sort = 'Sort: ';

  var no_meta_info_is_present = !meta_title && !meta_description && !meta_sort;
  var meta_header = '';
  if (!no_meta_info_is_present) {
    meta_header = comment_start + newline +
    (meta_title ? title_label + meta_title + newline : '') +
    (meta_description ? description_label + meta_description + newline : '') +
    (meta_sort ? description_sort + meta_sort + newline : '') +
    comment_end + newline + newline;
  }

  return meta_header;
}

// Exports
module.exports = create_meta_info;
