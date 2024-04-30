import path from 'node:path';
import fs from 'fs-extra';
import { glob } from 'glob';
import _ from 'underscore';
import _s from 'underscore.string';
import yaml from 'js-yaml';
import utils from './utils.js';
import content_processors from '../functions/content_processors.js';

// TODO: Scan on start/change, not on every request
async function handler(activePageSlug, config) {
  activePageSlug = activePageSlug || '';
  const baseSlug = activePageSlug.split(/[\\/]/).slice(0, -1).join('/');
  const contentDir = utils.normalizeDir(path.normalize(config.content_dir));

  // TODO: Fix extra trailing /
  const files = await glob(`${contentDir}**/*`);
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
      const parent = _.find(filesProcessed, (item) => item.slug === dirSlug);
      if (parent) {
        parent.files.push(result);
      } else if (config.debug) {
        console.log('Content ignored', result.slug);
      }
    }
  }

  const sortedFiles = _.sortBy(filesProcessed, (cat) => cat.sort);
  sortedFiles.forEach((category) => {
    category.files = _.sortBy(category.files, (file) => file.sort);
  });

  return sortedFiles;
}

async function processFile(config, activePageSlug, contentDir, filePath) {
  const content_dir = path.normalize(contentDir);
  const page_sort_meta = config.page_sort_meta || '';
  const category_sort = config.category_sort || false;
  const shortPath = path.normalize(filePath).replace(content_dir, '').trim();
  const fileSlug = shortPath.split('\\').join('/');
  const stat = await fs.stat(filePath);

  if (stat.isDirectory()) {
    let sort = 0;
    // ignore directories that has an ignore file under it
    const ignoreFile = `${contentDir + shortPath}/ignore`;

    const ignoreExists = await fs.lstat(ignoreFile).then(
      (stat) => stat.isFile(),
      () => {},
    );
    if (ignoreExists) {
      if (config.debug) {
        console.log('Directory ignored', contentDir + shortPath);
      }

      return null;
    }

    let dirMetadata = {};
    try {
      const metaFile = await fs.readFile(
        path.join(contentDir, shortPath, 'meta'),
      );
      dirMetadata = content_processors.cleanObjectStrings(
        yaml.load(metaFile.toString('utf-8')),
      );
    } catch (e) {
      if (config.debug) {
        console.log('No meta file for', contentDir + shortPath);
      }
    }

    if (category_sort && !dirMetadata.sort) {
      try {
        const sortFile = await fs.readFile(
          path.join(contentDir, shortPath, 'sort'),
        );
        sort = parseInt(sortFile.toString('utf-8'), 10);
      } catch (e) {
        if (config.debug) {
          console.log('No sort file for', contentDir + shortPath);
        }
      }
    }

    return {
      slug: fileSlug,
      title:
        dirMetadata.title || _s.titleize(_s.humanize(path.basename(shortPath))),
      show_on_home: dirMetadata.show_on_home
        ? dirMetadata.show_on_home === 'true'
        : config.show_on_home_default,
      is_index: false,
      is_directory: true,
      show_on_menu: dirMetadata.show_on_menu
        ? dirMetadata.show_on_menu === 'true'
        : config.show_on_menu_default,
      active: activePageSlug.startsWith(`/${fileSlug}`),
      class: `category-${content_processors.cleanString(fileSlug)}`,
      sort: dirMetadata.sort || sort,
      description: dirMetadata.description || '',
      files: [],
    };
  }

  if (stat.isFile() && path.extname(shortPath) === '.md') {
    try {
      const file = await fs.readFile(filePath);
      let slug = fileSlug;
      let pageSort = 0;

      if (fileSlug.indexOf('index.md') > -1) {
        slug = slug.replace('index.md', '');
      }

      slug = slug.replace('.md', '').trim();

      const meta = content_processors.processMeta(file.toString('utf-8'));

      if (page_sort_meta && meta[page_sort_meta]) {
        pageSort = parseInt(meta[page_sort_meta], 10);
      }

      return {
        slug,
        title: meta.title ? meta.title : content_processors.slugToTitle(slug),
        show_on_home: meta.show_on_home
          ? meta.show_on_home === 'true'
          : config.show_on_home_default,
        is_directory: false,
        show_on_menu: meta.show_on_menu
          ? meta.show_on_menu === 'true'
          : config.show_on_menu_default,
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
