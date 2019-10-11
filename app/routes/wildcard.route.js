
'use strict';

// Modules
var path                           = require('path');
var fs                             = require('fs-extra');
var build_nested_pages             = require('../functions/build_nested_pages.js');
var marked                         = require('marked');
var toc                            = require('markdown-toc');
var remove_image_content_directory = require('../functions/remove_image_content_directory.js');

const contentProcessors = require('../functions/contentProcessors');
const contentsHandler = require('../core/contents');
const utils = require('../core/utils');

function route_wildcard (config) {
  return async function (req, res, next) {

    // Skip if nothing matched the wildcard Regex
    if (!req.params[0]) { return next(); }

    var suffix = 'edit';
    var slug   = req.params[0];
    if (slug === '/') { slug = '/index'; }

    // Normalize and strip trailing slash
    var file_path      = path.normalize(config.content_dir + slug).replace(/\/$|\\$/g, '');
    var file_path_orig = file_path;

    // Remove "/edit" suffix
    if (file_path.indexOf(suffix, file_path.length - suffix.length) !== -1) {
      file_path = file_path.slice(0, -suffix.length - 1);
    }

    if (!(await fs.pathExists(file_path))) { file_path += '.md'; }

    let content;
    try {
      content = await fs.readFile(file_path, 'utf8');
    } catch (error) {
      error.status = '404';
      error.message = config.lang.error['404'];
      return next(error);
    }

    // Process Markdown files
    if (path.extname(file_path) === '.md') {

      // Meta
      var meta = contentProcessors.processMeta(content);
      meta.custom_title = meta.title;
      if (!meta.title) { meta.title = contentProcessors.slugToTitle(file_path); }

      // Content
      content = contentProcessors.stripMeta(content);
      content = contentProcessors.processVars(content, config);

      var template = meta.template || 'page';
      var render   = template;

      // Check for "/edit" suffix
      if (file_path_orig.indexOf(suffix, file_path_orig.length - suffix.length) !== -1) {

        // Edit Page
        if ((config.authentication || config.authentication_for_edit) && !req.session.loggedIn) {
          res.redirect('/login');
          return;
        }
        render  = 'edit';

      } else {

        // Render Table of Contents
        if (config.table_of_contents) {
          var tableOfContents = toc(content, config.table_of_contents_options);
          if (tableOfContents.content) {
            content = '#### Table of Contents\n' + tableOfContents.content + '\n\n' + content;
          }
        }

        // Render Markdown
        marked.setOptions({
          langPrefix : ''
        });
        content = marked(content);

      }

      var pageList = remove_image_content_directory(config, await contentsHandler(slug, config));

      var loggedIn = ((config.authentication || config.authentication_for_edit) ? req.session.loggedIn : false);

      var canEdit = false;
      if (config.authentication || config.authentication_for_edit) {
        canEdit = loggedIn && config.allow_editing;
      } else {
        canEdit = config.allow_editing;
      }

      return res.render(render, {
        config        : config,
        pages         : build_nested_pages(pageList),
        meta          : meta,
        content       : content,
        current_url   : req.protocol + '://' + req.get('host') + req.originalUrl,
        body_class    : template + '-' + contentProcessors.cleanString(slug),
        last_modified : await utils.getLastModified(config, meta, file_path),
        lang          : config.lang,
        loggedIn      : loggedIn,
        username      : (config.authentication ? req.session.username : null),
        canEdit       : canEdit
      });

    }
  };
}

// Exports
module.exports = route_wildcard;
