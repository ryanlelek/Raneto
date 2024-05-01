// Modules
import path from 'node:path';
import _ from 'underscore';
import fs from 'fs-extra';
import { marked } from 'marked';
import toc from '@fixhq/markdown-toc';
import build_nested_pages from '../functions/build_nested_pages.js';
import remove_image_content_directory from '../functions/remove_image_content_directory.js';
import content_processors from '../functions/content_processors.js';
import contents_handler from '../core/contents.js';
import utils from '../core/utils.js';

function route_wildcard(config) {
  return async function (req, res, next) {
    // Skip if nothing matched the wildcard Regex
    if (!req.params[0]) {
      return next();
    }

    const suffix = 'edit';
    let slug = req.params[0];
    if (slug === '/') {
      slug = '/index';
    }

    // Normalize and strip trailing slash
    let file_path = path
      .normalize(config.content_dir + slug)
      .replace(/\/$|\\$/g, '');
    const file_path_orig = file_path;

    // Remove "/edit" suffix
    if (file_path.indexOf(suffix, file_path.length - suffix.length) !== -1) {
      file_path = file_path.slice(0, -suffix.length - 1);
    }

    if (!(await fs.pathExists(file_path))) {
      file_path += '.md';
    }

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
      const meta = content_processors.processMeta(content);
      meta.custom_title = meta.title;
      if (!meta.title) {
        meta.title = content_processors.slugToTitle(file_path);
      }

      // Content
      content = content_processors.stripMeta(content);
      content = content_processors.processVars(content, config);

      const template = meta.template || 'page';
      let render = template;

      // Check for "/edit" suffix
      if (
        file_path_orig.indexOf(
          suffix,
          file_path_orig.length - suffix.length,
        ) !== -1
      ) {
        // Edit Page
        if (
          (config.authentication || config.authentication_for_edit) &&
          !req.session.loggedIn
        ) {
          res.redirect(`${config.base_url}/login`);
          return;
        }
        render = 'edit';
      } else {
        // Render Table of Contents
        if (config.table_of_contents) {
          const tableOfContents = toc(
            content,
            config.table_of_contents_options,
          );
          if (tableOfContents.content) {
            content = `#### Table of Contents\n${tableOfContents.content}\n\n${content}`;
          }
        }

        // Render Markdown
        marked.use({
          // Removed in v8.x
          // https://github.com/markedjs/marked/releases/tag/v8.0.0
          // mangle: false,
          // headerIds: false,
        });
        content = marked(content);
      }

      const pageList = remove_image_content_directory(
        config,
        _.chain(await contents_handler(slug, config))
          .filter((page) => page.show_on_menu)
          .map((page) => {
            page.files = _.filter(page.files, (file) => {
              return file.show_on_menu;
            });
            return page;
          })
          .value(),
      );

      const loggedIn =
        config.authentication || config.authentication_for_edit
          ? req.session.loggedIn
          : false;

      let canEdit = false;
      if (config.authentication || config.authentication_for_edit) {
        canEdit = loggedIn && config.allow_editing;
      } else {
        canEdit = config.allow_editing;
      }

      return res.render(render, {
        config,
        pages: build_nested_pages(pageList),
        meta,
        content,
        current_url: `${req.protocol}://${req.get('host')}${
          config.path_prefix
        }${req.originalUrl}`,
        body_class: `${template}-${content_processors.cleanString(slug)}`,
        last_modified: await utils.getLastModified(config, meta, file_path),
        lang: config.lang,
        loggedIn,
        username: config.authentication ? req.session.username : null,
        canEdit,
      });
    }
  };
}

// Exports
export default route_wildcard;
