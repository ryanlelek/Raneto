// Modules
import path from 'node:path';
import fs from 'fs-extra';
import sm from 'sitemap';
import _ from 'underscore';
import content_processors from '../functions/content_processors.js';
import utils from '../core/utils.js';

function route_sitemap(config) {
  return async function (req, res, next) {
    const hostname = config.hostname || req.headers.host;
    const content_dir = path.normalize(config.content_dir);

    // get list md files
    try {
      const _files = await listFiles(content_dir);

      const files = _.filter(_files, (file) => file.substr(-3) === '.md');

      const filesPath = files.map((file) => file.replace(content_dir, ''));

      // generate list urls
      const urls = filesPath.map(
        (file) => `/${file.replace('.md', '').replace('\\', '/')}`,
      );

      // create sitemap.xml
      // TODO: Make protocol dynamic
      const sitemap = sm.createSitemap({
        hostname: `http://${hostname}`,
        cacheTime: 600000,
      });

      for (let i = 0, len = urls.length; i < len; i++) {
        const content = await fs.readFile(files[i], 'utf8');
        // Need to override the datetime format for sitemap
        const conf = {
          datetime_format: 'YYYY-MM-DD',
        };
        sitemap.add({
          url: (config.prefix_url || '') + urls[i],
          changefreq: 'weekly',
          priority: 0.8,
          lastmod: await utils.getLastModified(
            conf,
            content_processors.processMeta(content),
            files[i],
          ),
        });
      }

      res.header('Content-Type', 'application/xml');
      res.send(sitemap.toString());
    } catch (error) {
      next(error);
    }
  };
}

async function listFiles(dir) {
  const entries = await fs.readdir(dir);

  // Build an array of arrays with all sub-files
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const filePath = path.join(dir, entry);
      const isDir = (await fs.stat(filePath)).isDirectory();
      return isDir ? listFiles(filePath) : [filePath];
    }),
  );

  // Return the flattened array
  return paths.reduce((list, paths) => list.concat(paths), []);
}

// Exports
export default route_sitemap;
