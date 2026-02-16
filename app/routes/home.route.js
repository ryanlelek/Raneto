// Modules
import fs from 'fs-extra';
import buildNestedPages from '../functions/build_nested_pages.js';
import getFilepath from '../functions/get_filepath.js';
import excludeImageDirectory from '../functions/exclude_image_directory.js';
import getAuthContext from '../functions/get_auth_context.js';
import contents_handler from '../core/contents.js';
import utils from '../core/utils.js';

function routeHome(config) {
  return async function (req, res, next) {
    // Generate filepath
    // Sanitized within function
    const filepath = getFilepath({
      content: config.content_dir,
      filename: 'index',
    });

    // Do we have an index.md file?
    // If so, use that.
    if (await fs.pathExists(`${filepath}.md`)) {
      return next();
    }

    // Otherwise, we're generating the home page listing
    const templateFilepath = getFilepath({
      content: [config.theme_dir, config.theme_name, 'templates'].join('/'),
      filename: 'home.html',
    });

    // Filter out the image content directory and items with show_on_home == false
    const pageList = excludeImageDirectory(
      config,
      (await contents_handler('/index', config))
        .filter((page) => page.show_on_home)
        .map((page) => {
          page.files = page.files.filter((file) => file.show_on_home);
          return page;
        }),
    );

    return res.render('home', {
      config,
      pages: buildNestedPages(pageList),
      body_class: 'page-home',
      meta: config.home_meta,
      last_modified: await utils.getLastModified(
        config,
        config.home_meta,
        templateFilepath,
      ),
      lang: config.lang,
      ...getAuthContext(config, req.session),
    });
  };
}

// Exports
export default routeHome;
