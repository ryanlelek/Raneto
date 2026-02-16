// Modules
import path from 'node:path';
import fs from 'fs-extra';
import _ from 'lodash';
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
const _metaRegex = /^\uFEFF?\/\*([\s\S]*?)\*\//i;
const _metaRegexYaml = /^\uFEFF?---([\s\S]*?)---/i;

function cleanString(str, use_underscore) {
  const u = use_underscore || false;
  str = str.replace(/\//g, ' ').trim();
  if (u) {
    return _.snakeCase(str);
  }
  return _.trim(_.kebabCase(str), '-');
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
  return _.startCase(path.basename(slug).replace(/[-_]/g, ' '));
}

// Strip meta from Markdown content
function stripMeta(markdownContent) {
  if (_metaRegex.test(markdownContent)) {
    return markdownContent.replace(_metaRegex, '').trim();
  }
  if (_metaRegexYaml.test(markdownContent)) {
    return markdownContent.replace(_metaRegexYaml, '').trim();
  }
  return markdownContent.trim();
}

// Get metadata from Markdown content
function processMeta(markdownContent) {
  if (_metaRegex.test(markdownContent)) {
    const meta = {};
    const metaArr = markdownContent.match(_metaRegex);
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

  if (_metaRegexYaml.test(markdownContent)) {
    const metaArr = markdownContent.match(_metaRegexYaml);
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
