
'use strict';

// Modules
var path                           = require('path');
var fs                             = require('fs');
var build_nested_pages             = require('../functions/build_nested_pages.js');
var get_filepath                   = require('../functions/get_filepath.js');
var marked                         = require('marked');
var toc                            = require('markdown-toc');
var remove_image_content_directory = require('../functions/remove_image_content_directory.js');

const contentProcessors = require('../functions/contentProcessors');
const pageHandler = require('../core/page');
const contentsHandler = require('../core/contents');
const categoryHandler = require('../core/category');
const utils = require('../core/utils');

function route_wildcard (config) {
  return function (req, res, next) {
    var template, render;

    // Skip if nothing matched the wildcard Regex
    if (!req.params[0]) { return next(); }

    var suffix = 'edit';
    var slug   = req.params[0];
    if (slug === '/') { slug = '/index'; }

    var file_path      = path.normalize(config.content_dir + slug);
    var file_path_orig = file_path;

    // Remove "/edit" suffix
    if (file_path.indexOf(suffix, file_path.length - suffix.length) !== -1) {
      file_path = file_path.slice(0, -suffix.length - 1);
    }

    var pageList = remove_image_content_directory(config, contentsHandler(slug, config));
    var pages = build_nested_pages(pageList);

    var loggedIn = ((config.authentication || config.authentication_for_edit) ? req.session.loggedIn : false);

    var canEdit = false;
    if (config.authentication || config.authentication_for_edit) {
      canEdit = loggedIn && config.allow_editing;
    } else {
      canEdit = config.allow_editing;
    }

    if (fs.existsSync(file_path)) {
      template = render = 'category';

      var template_filepath = get_filepath({
        content  : [config.theme_dir, config.theme_name, 'templates'].join('/'),
        filename : 'category.html'
      });

      var page = categoryHandler(pages, slug);

      if (page) {
        // Get the excerpt for each file in the category
        page.files.forEach(file => {

          let _file = pageHandler(path.normalize(config.content_dir + file.slug) + '.md', config);

          if (_file) file.excerpt = _file.excerpt;

        });
      }

      return res.render(render, {
        config        : config,
        pages         : pages,
        page          : page,
        meta          : config.home_meta,
        body_class    : template + '-' + contentProcessors.cleanString(slug),
        last_modified : utils.getLastModified(config, config.home_meta, template_filepath),
        lang          : config.lang,
        loggedIn      : loggedIn,
        username      : (config.authentication ? req.session.username : null),
        canEdit       : canEdit
      });
    } else {
      file_path += '.md';

      fs.readFile(file_path, 'utf8', function (error, content) {

        if (error) {
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

          template = meta.template || 'page';
          render   = template;

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
              var tableOfContents = toc(content);
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
        }

        return res.render(render, {
          config        : config,
          pages         : pages,
          meta          : meta,
          content       : content,
          body_class    : template + '-' + contentProcessors.cleanString(slug),
          last_modified : utils.getLastModified(config, meta, file_path),
          lang          : config.lang,
          loggedIn      : loggedIn,
          username      : (config.authentication ? req.session.username : null),
          canEdit       : canEdit
        });

      });

    }
  };
}

// Exports
module.exports = route_wildcard;
