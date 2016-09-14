
'use strict';

// Modules
var fs     = require('fs');
var moment = require('moment');

// Returns a formated datetime
function get_last_modified (config,meta,file_path) {

  if(typeof meta.modified !== 'undefined') {
    return moment(meta.modified).format(config.datetime_format);
  } else {
    return moment(fs.lstatSync(file_path).mtime).format(config.datetime_format);
  }

}

// Exports
module.exports = get_last_modified;
