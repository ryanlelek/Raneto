// Modules
import sanitizeHtml from 'sanitize-html';
import excludeImageDirectory from '../functions/exclude_image_directory.js';
import sanitize from '../functions/sanitize.js';
import getAuthContext from '../functions/get_auth_context.js';
import search_handler from '../core/search.js';
import contents_handler from '../core/contents.js';

function route_search(config) {
  return async function (req, res, next) {
    // Skip if Search not present
    if (!req.query.search) {
      return next();
    }

    // Strip HTML tags from search query using well-tested library
    const strippedQuery = sanitizeHtml(req.query.search, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const sanitizedQuery = sanitize(strippedQuery);

    let searchResults = [];
    let pageListSearch = [];
    try {
      searchResults = await search_handler(sanitizedQuery, config);
      pageListSearch = excludeImageDirectory(
        config,
        await contents_handler(null, config),
      );
    } catch (e) {
      console.log(e.message);
    }

    return res.render('search', {
      config,
      pages: pageListSearch,
      search: sanitizedQuery,
      searchResults,
      body_class: 'page-search',
      lang: config.lang,
      ...getAuthContext(config, req.session),
    });
  };
}

// Exports
export default route_search;
