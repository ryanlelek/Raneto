// Modules
import fs from 'fs-extra';
import _ from 'underscore';
import build_nested_pages from '../functions/build_nested_pages.js';
import get_filepath from '../functions/get_filepath.js';
import remove_image_content_directory from '../functions/remove_image_content_directory.js';
import contents_handler from '../core/contents.js';
import utils from '../core/utils.js';

function route_home(config) {
  return async function (req, res, next) {
    // Generate filepath
    // Sanitized within function
    let filepath = get_filepath({
      content: config.content_dir,
      filename: 'index',
    });

    // Do we have an index.md file?
    // If so, use that.
    if (await fs.pathExists(`${filepath}.md`)) {
      return next();
    }

    // Otherwise, we're generating the home page listing
    const suffix = 'edit';
    if (filepath.indexOf(suffix, filepath.length - suffix.length) !== -1) {
      filepath = filepath.slice(0, -suffix.length - 1);
    }

    // Generate filepath
    // Sanitized within function
    const template_filepath = get_filepath({
      content: [config.theme_dir, config.theme_name, 'templates'].join('/'),
      filename: 'home.html',
    });

    // Filter out the image content directory and items with show_on_home == false
    const pageList = remove_image_content_directory(
      config,
      _.chain(await contents_handler('/index', config))
        .filter((page) => page.show_on_home)
        .map((page) => {
          page.files = _.filter(page.files, (file) => file.show_on_home);
          return page;
        })
        .value(),
    );

    return res.render('home', {
      config,
      pages: build_nested_pages(pageList),
      body_class: 'page-home',
      meta: config.home_meta,
      last_modified: await utils.getLastModified(
        config,
        config.home_meta,
        template_filepath,
      ),
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
export default route_home;
