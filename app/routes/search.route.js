
'use strict';

// Modules
var validator                      = require('validator');
var _s                             = require('underscore.string');
var remove_image_content_directory = require('../functions/remove_image_content_directory.js');

const searchHandler = require('../core/search');
const contentsHandler = require('../core/contents');

function route_search (config) {
  return async function (req, res, next) {

    // Skip if Search not present
    if (!req.query.search) { return next(); }

    // remove < and >
    var rawQuery   = _s.stripTags(req.query.search);

    // TODO: Add Test
    // remove /, ', " and & from query
    // strip > < again (stripTags may not be working as intended)
    var invalidChars   = '&\'"/><';
    var sanitizedQuery = validator.blacklist(rawQuery, invalidChars);
    // trim and escape
    sanitizedQuery = validator.trim(sanitizedQuery);
    sanitizedQuery = validator.escape(sanitizedQuery);

    // Using try/catch seems broken
    var searchResults = [];
    var pageListSearch = [];
    try {
      searchResults = await searchHandler(sanitizedQuery, config);
      pageListSearch = remove_image_content_directory(config, await contentsHandler(null, config));
    } catch (e) {
      // Continue with defaults of empty arrays
    }

    // TODO: Move to Raneto Core
    // Loop through Results and Extract Category
    searchResults.forEach(function (result) {
      result.category = null;
      var split = result.slug.split('/');
      if (split.length > 1) {
        result.category = split[0];
      }
    });

    return res.render('search', {
      config,
      pages         : pageListSearch,
      search        : sanitizedQuery,
      searchResults,
      body_class    : 'page-search',
      lang          : config.lang,
      loggedIn      : ((config.authentication || config.authentication_for_edit) ? req.session.loggedIn : false),
      username      : ((config.authentication || config.authentication_for_edit) ? req.session.username : null)
    });

  };
}

// Exports
module.exports = route_search;
