
'use strict';

// Modules
var yaml = require('js-yaml');

// Returns an empty string if all input strings are empty
function create_meta_info (meta_title, meta_description, meta_sort) {

  var yamlDocument = {};
  var meta_info_is_present = meta_title && meta_description && meta_sort;

  if (meta_info_is_present) {
    if (meta_title)       { yamlDocument.Title       = meta_title;              }
    if (meta_description) { yamlDocument.Description = meta_description;        }
    if (meta_sort)        { yamlDocument.Sort        = parseInt(meta_sort, 10); }

    return '---\n' + yaml.safeDump(yamlDocument) + '---\n';
  } else {
    return '---\n---\n';
  }

}

// Exports
module.exports = create_meta_info;
