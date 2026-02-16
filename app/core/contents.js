import path from 'node:path';
import fs from 'fs-extra';
import { glob } from 'glob';
import _ from 'lodash';
import yaml from 'js-yaml';
import utils from './utils.js';
import content_processors from '../functions/content_processors.js';

const metaBool = (value, fallback) => (value ? value === 'true' : fallback);

// TODO: Scan on start/change, not on every request
async function handler(activePageSlug, config) {
  activePageSlug = activePageSlug || '';
  const baseSlug = activePageSlug.split(/[\\/]/).slice(0, -1).join('/');
  const contentDir = utils.normalizeDir(path.normalize(config.content_dir));

  const files = await glob(path.join(contentDir, '**', '*'));
  const filesProcessed = [];

  filesProcessed.push({
    slug: '.',
    title: '',
    show_on_home: true,
    show_on_menu: true,
    is_index: true,
    active: baseSlug === '',
    class: 'category-index',
    sort: 0,
    files: [],
  });

  const results = await Promise.all(
    files.map((filePath) =>
      processFile(config, activePageSlug, contentDir, filePath),
    ),
  );

  for (const result of results) {
    if (result && result.is_directory) {
      filesProcessed.push(result);
    } else if (result && result.is_directory === false) {
      const dirSlug = path.dirname(result.slug);
      const parent = filesProcessed.find((item) => item.slug === dirSlug);
      if (parent) {
        parent.files.push(result);
      } else if (config.debug) {
        console.log('Content ignored', result.slug);
      }
    }
  }

  const sortedFiles = filesProcessed.toSorted((a, b) => a.sort - b.sort);
  sortedFiles.forEach((category) => {
    category.files = category.files.toSorted((a, b) => a.sort - b.sort);
  });

  return sortedFiles;
}

async function processFile(config, activePageSlug, contentDir, filePath) {
  const page_sort_meta = config.page_sort_meta || '';
  const category_sort = config.category_sort || false;
  const shortPath = path.relative(contentDir, filePath);
  const fileSlug = shortPath.split('\\').join('/');
  const stat = await fs.stat(filePath);

  if (stat.isDirectory()) {
    let sort = 0;
    // ignore directories that has an ignore file under it
    const ignoreFile = path.join(contentDir, shortPath, 'ignore');

    const ignoreExists = await fs.lstat(ignoreFile).then(
      (stat) => stat.isFile(),
      () => false,
    );
    if (ignoreExists) {
      if (config.debug) {
        console.log('Directory ignored', path.join(contentDir, shortPath));
      }

      return null;
    }

    let dirMetadata = {};
    try {
      const metaFile = await fs.readFile(
        path.join(contentDir, shortPath, 'meta'),
        'utf8',
      );
      dirMetadata = content_processors.cleanObjectStrings(yaml.load(metaFile));
    } catch (e) {
      if (config.debug) {
        console.log(
          'No meta file for',
          path.join(contentDir, shortPath),
          e.message,
        );
      }
    }

    if (category_sort && !dirMetadata.sort) {
      try {
        const sortFile = await fs.readFile(
          path.join(contentDir, shortPath, 'sort'),
          'utf8',
        );
        sort = parseInt(sortFile, 10);
      } catch (e) {
        if (config.debug) {
          console.log(
            'No sort file for',
            path.join(contentDir, shortPath),
            e.message,
          );
        }
      }
    }

    return {
      slug: fileSlug,
      title:
        dirMetadata.title ||
        _.startCase(path.basename(shortPath).replace(/[-_]/g, ' ')),
      show_on_home: metaBool(
        dirMetadata.show_on_home,
        config.show_on_home_default,
      ),
      is_index: false,
      is_directory: true,
      show_on_menu: metaBool(
        dirMetadata.show_on_menu,
        config.show_on_menu_default,
      ),
      active: activePageSlug.startsWith(`/${fileSlug}`),
      class: `category-${content_processors.cleanString(fileSlug)}`,
      sort: dirMetadata.sort || sort,
      description: dirMetadata.description || '',
      files: [],
    };
  }

  if (stat.isFile() && path.extname(shortPath) === '.md') {
    try {
      const file = await fs.readFile(filePath, 'utf8');
      let slug = fileSlug;
      let pageSort = 0;

      if (fileSlug.includes('index.md')) {
        slug = slug.replace('index.md', '');
      }

      slug = slug.replace('.md', '').trim();

      const meta = content_processors.processMeta(file);

      if (page_sort_meta && meta[page_sort_meta]) {
        pageSort = parseInt(meta[page_sort_meta], 10);
      }

      return {
        slug,
        title: meta.title ? meta.title : content_processors.slugToTitle(slug),
        show_on_home: metaBool(meta.show_on_home, config.show_on_home_default),
        is_directory: false,
        show_on_menu: metaBool(meta.show_on_menu, config.show_on_menu_default),
        active: activePageSlug.trim() === `/${slug}`,
        sort: pageSort,
      };
    } catch (e) {
      if (config.debug) {
        console.log(e);
      }
    }
  }
}

export default handler;
