function remove_image_content_directory(config, pageList) {
  const imageSlug = config.image_url.replace(/\//g, '');
  return pageList.filter((page) => page.slug !== imageSlug);
}

// Exports
export default remove_image_content_directory;
