// Modules
import path from 'node:path';
import fs from 'fs-extra';
import { marked } from 'marked';
import toc from '@fixhq/markdown-toc';
import sanitizeHtmlOutput from '../functions/sanitize_html_output.js';
import buildNestedPages from '../functions/build_nested_pages.js';
import excludeImageDirectory from '../functions/exclude_image_directory.js';
import getAuthContext from '../functions/get_auth_context.js';
import { resolveFilepath } from '../functions/get_filepath.js';
import content_processors from '../functions/content_processors.js';
import contents_handler from '../core/contents.js';
import utils from '../core/utils.js';
import { gfmHeadingId } from 'marked-gfm-heading-id';

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

    // Resolve and strip trailing slash
    const contentDirResolved = path.resolve(config.content_dir);
    let filePath = path
      .resolve(config.content_dir, slug.replace(/^\//, ''))
      .replace(/\/$|\\$/g, '');
    const filePathOrig = filePath;

    // Remove "/edit" suffix
    if (filePath.endsWith(suffix)) {
      filePath = filePath.slice(0, -suffix.length - 1);
    }

    // Normalize path and prevent path traversal outside content directory
    let safeFilePath = path.resolve(
      config.content_dir,
      path.relative(config.content_dir, filePath),
    );
    if (!safeFilePath.startsWith(contentDirResolved)) {
      const error = new Error(config.lang.error['404']);
      error.status = 404;
      return next(error);
    }

    safeFilePath = await resolveFilepath(safeFilePath);

    // Re-validate after .md append
    safeFilePath = path.resolve(safeFilePath);
    if (!safeFilePath.startsWith(contentDirResolved)) {
      const error = new Error(config.lang.error['404']);
      error.status = 404;
      return next(error);
    }

    let content;
    try {
      content = await fs.readFile(safeFilePath, 'utf8');
    } catch (error) {
      error.status = 404;
      error.message = config.lang.error['404'];
      return next(error);
    }

    // Process Markdown files
    if (path.extname(safeFilePath) === '.md') {
      // Meta
      const meta = content_processors.processMeta(content);
      meta.custom_title = meta.title;
      if (!meta.title) {
        meta.title = content_processors.slugToTitle(safeFilePath);
      }

      // Content
      content = content_processors.stripMeta(content);
      content = content_processors.processVars(content, config);

      const template = meta.template || 'page';
      let render = template;

      // Check for "/edit" suffix
      if (filePathOrig.endsWith(suffix)) {
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

        marked.use(gfmHeadingId());
        content = sanitizeHtmlOutput(marked(content));
      }

      const pageList = excludeImageDirectory(
        config,
        (await contents_handler(slug, config))
          .filter((page) => page.show_on_menu)
          .map((page) => {
            page.files = page.files.filter((file) => file.show_on_menu);
            return page;
          }),
      );

      const authContext = getAuthContext(config, req.session);

      return res.render(render, {
        config,
        pages: buildNestedPages(pageList),
        meta,
        content,
        current_url: `${req.protocol}://${req.get('host')}${
          config.path_prefix
        }${req.originalUrl}`,
        body_class: `${template}-${content_processors.cleanString(slug)}`,
        last_modified: await utils.getLastModified(config, meta, safeFilePath),
        lang: config.lang,
        ...authContext,
      });
    }
  };
}

// Exports
export default route_wildcard;
