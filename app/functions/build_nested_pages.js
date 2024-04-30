function build_nested_pages(pages) {
  const result = [];
  let i = pages.length;

  while (i--) {
    if (pages[i].slug.split('/').length > 1) {
      const parent = find_by_slug(pages, pages[i]);
      if (parent) {
        parent.files.unshift(pages[i]);
      }
    } else {
      result.unshift(pages[i]);
    }
  }

  return result;
}

function find_by_slug(pages, page) {
  return pages.find(
    (element) => element.slug === page.slug.split('/').slice(0, -1).join('/'),
  );
}

// Exports
export default build_nested_pages;
