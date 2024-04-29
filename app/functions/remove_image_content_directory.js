function remove_image_content_directory(config, pageList) {
  for (let i = 0; i < pageList.length; i++) {
    if (pageList[i].slug === config.image_url.replace(/\//g, '')) {
      pageList.splice(i, 1);
    }
  }
  return pageList;
}

// Exports
export default remove_image_content_directory;
