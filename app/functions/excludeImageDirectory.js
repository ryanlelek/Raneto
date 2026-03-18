function excludeImageDirectory(config, pageList) {
  const imageSlug = config.image_url.replaceAll('/', '');
  return pageList.filter((page) => page.slug !== imageSlug);
}

// Exports
export default excludeImageDirectory;
