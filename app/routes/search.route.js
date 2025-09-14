// Modules
import sanitizeHtml from 'sanitize-html';
import remove_image_content_directory from '../functions/remove_image_content_directory.js';
import sanitize from '../functions/sanitize.js';
import search_handler from '../core/search.js';
import contents_handler from '../core/contents.js';

function route_search(config) {
  return async function (req, res, next) {
    // Skip if Search not present
    if (!req.query.search) {
      return next();
    }

    // Strip HTML tags from search query using well-tested library
    const rawQuery = sanitizeHtml(req.query.search, {
      allowedTags: [],
      allowedAttributes: {},
    });
    const sanitizedQuery = sanitize(rawQuery);

    // TODO: Using try/catch seems broken
    let searchResults = [];
    let pageListSearch = [];
    try {
      searchResults = await search_handler(sanitizedQuery, config);
      pageListSearch = remove_image_content_directory(
        config,
        await contents_handler(null, config),
      );
    } catch (e) {
      // Continue with defaults of empty arrays
      console.log(e.message);
    }

    // TODO: Move to Raneto Core
    // Filter out null results and extract category
    const validResults = searchResults.filter(
      (result) => result !== null && result !== undefined,
    );
    validResults.forEach((result) => {
      result.category = null;
      const split = result.slug.split('/');
      if (split.length > 1) {
        result.category = split[0];
      }
    });

    return res.render('search', {
      config,
      pages: pageListSearch,
      search: sanitizedQuery,
      searchResults: validResults,
      body_class: 'page-search',
      lang: config.lang,
      loggedIn:
        config.authentication || config.authentication_for_edit
          ? req.session.loggedIn
          : false,
      username:
        config.authentication || config.authentication_for_edit
          ? req.session.username
          : null,
    });
  };
}

// Exports
export default route_search;
