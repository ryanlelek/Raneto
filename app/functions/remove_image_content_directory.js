
'use strict';

function remove_image_content_directory (config, pageList) {
  var i;
  for (i = 0; i < pageList.length; i++) {
    if (pageList[i].slug === config.image_url.replace(/\//g, '')) {
      pageList.splice(i, 1);
    }
  }
  return pageList;
}

// Exports
module.exports = remove_image_content_directory;
