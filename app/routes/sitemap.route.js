// Modules
import { Readable } from 'node:stream';
import path from 'node:path';
import fs from 'fs-extra';
import { SitemapStream, streamToPromise } from 'sitemap';
import content_processors from '../functions/content_processors.js';
import utils from '../core/utils.js';

function route_sitemap(config) {
  return async function (req, res, next) {
    const hostname = config.hostname || req.headers.host;
    const content_dir = path.normalize(config.content_dir);

    try {
      const _files = await listFiles(content_dir);
      const files = _files.filter((file) => file.endsWith('.md'));
      const filesPath = files.map((file) => file.replace(content_dir, ''));
      const urls = filesPath.map(
        (file) => `/${file.replace('.md', '').replace(/\\/g, '/')}`,
      );

      const links = [];
      for (let i = 0, len = urls.length; i < len; i++) {
        const content = await fs.readFile(files[i], 'utf8');
        const conf = {
          content_dir: config.content_dir,
          theme_dir: config.theme_dir,
          datetime_format: 'YYYY-MM-DD',
        };
        links.push({
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

      const stream = new SitemapStream({
        hostname: `https://${hostname}`,
      });
      const xml = await streamToPromise(Readable.from(links).pipe(stream));

      res.header('Content-Type', 'application/xml');
      res.send(xml.toString());
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
