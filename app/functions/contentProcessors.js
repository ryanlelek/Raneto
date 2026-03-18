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

function cleanString(str, useUnderscore = false) {
  str = str.replaceAll('/', ' ').trim();
  if (useUnderscore) {
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
  slug = slug.replaceAll('.md', '').trim();
  return startCase(path.basename(slug).replaceAll(/[-_]/g, ' '));
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
      const lines = metaString.split('\n');
      for (const line of lines) {
        const colonIndex = line.indexOf(': ');
        if (colonIndex <= 0) {
          continue;
        }
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 2).trim();
        if (key && value) {
          meta[cleanString(key, true)] = value;
        }
      }
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
      markdownContent = markdownContent.replaceAll(
        new RegExp(`%${v.name}%`, 'g'),
        v.content,
      );
    });
  }
  if (config.base_url !== undefined) {
    markdownContent = markdownContent.replaceAll('%base_url%', config.base_url);
  }
  if (config.image_url !== undefined) {
    markdownContent = markdownContent.replaceAll(
      '%image_url%',
      config.image_url,
    );
  }
  return markdownContent;
}

async function extractDocument(contentDir, filePath, debug) {
  try {
    const file = await fs.readFile(filePath, 'utf8');
    const meta = processMeta(file);

    const id = filePath.replaceAll(contentDir, '').trim();
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
