// Modules
import path from 'node:path';
import fs from 'fs-extra';
import snakeCase from 'lodash/snakeCase.js';
import kebabCase from 'lodash/kebabCase.js';
import startCase from 'lodash/startCase.js';
import trim from 'lodash/trim.js';
import yaml from 'js-yaml';

// Regex for page meta (considers Byte Order Mark \uFEFF in case there's one)
// Look for the the following header formats at the beginning of the file:
// /*
// {header string}
// */
//   or
// ---
// {header string}
// ---
// TODO: DEPRECATED Non-YAML
const META_REGEX = /^\uFEFF?\/\*([\s\S]*?)\*\//i;
const META_REGEX_YAML = /^\uFEFF?---([\s\S]*?)---/i;

function cleanString(str, useUnderscore) {
  const u = useUnderscore || false;
  str = str.replace(/\//g, ' ').trim();
  if (u) {
    return snakeCase(str);
  }
  return trim(kebabCase(str), '-');
}

// Clean object strings.
function cleanObjectStrings(obj) {
  const cleanObj = {};
  for (const field in obj) {
    if (Object.hasOwn(obj, field)) {
      cleanObj[cleanString(field, true)] = `${obj[field]}`.trim();
    }
  }
  return cleanObj;
}

// Convert a slug to a title
function slugToTitle(slug) {
  slug = slug.replace('.md', '').trim();
  return startCase(path.basename(slug).replace(/[-_]/g, ' '));
}

// Strip meta from Markdown content
function stripMeta(markdownContent) {
  if (META_REGEX.test(markdownContent)) {
    return markdownContent.replace(META_REGEX, '').trim();
  }
  if (META_REGEX_YAML.test(markdownContent)) {
    return markdownContent.replace(META_REGEX_YAML, '').trim();
  }
  return markdownContent.trim();
}

// Get metadata from Markdown content
function processMeta(markdownContent) {
  if (META_REGEX.test(markdownContent)) {
    const meta = {};
    const metaArr = markdownContent.match(META_REGEX);
    const metaString = metaArr?.[1]?.trim() ?? '';

    if (metaString) {
      const metas = metaString.match(/(.*): (.*)/gi);
      metas.forEach((item) => {
        const parts = item.split(': ');
        if (parts[0] && parts[1]) {
          meta[cleanString(parts[0], true)] = parts[1].trim();
        }
      });
    }
    return meta;
  }

  if (META_REGEX_YAML.test(markdownContent)) {
    const metaArr = markdownContent.match(META_REGEX_YAML);
    const metaString = metaArr?.[1]?.trim() ?? '';
    const yamlObject = yaml.load(metaString);
    return cleanObjectStrings(yamlObject);
  }

  return {};
}

// Replace content variables in Markdown content
function processVars(markdownContent, config) {
  if (config.variables && Array.isArray(config.variables)) {
    config.variables.forEach((v) => {
      markdownContent = markdownContent.replace(
        new RegExp(`%${v.name}%`, 'g'),
        v.content,
      );
    });
  }
  if (config.base_url !== undefined) {
    markdownContent = markdownContent.replace(/%base_url%/g, config.base_url);
  }
  if (config.image_url !== undefined) {
    markdownContent = markdownContent.replace(/%image_url%/g, config.image_url);
  }
  return markdownContent;
}

async function extractDocument(contentDir, filePath, debug) {
  try {
    const file = await fs.readFile(filePath, 'utf8');
    const meta = processMeta(file);

    const id = filePath.replace(contentDir, '').trim();
    const title = meta.title ? meta.title : slugToTitle(id);
    const body = file;

    return { id, title, body };
  } catch (e) {
    if (debug) {
      console.log(e);
    }
    return null;
  }
}

export default {
  cleanString,
  cleanObjectStrings,
  extractDocument,
  slugToTitle,
  stripMeta,
  processMeta,
  processVars,
};
