import path from 'node:path';
import fs from 'fs-extra';
import _ from 'lodash';
import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';
import utils from './utils.js';
import content_processors from '../functions/content_processors.js';
import sanitizeHtmlOutput from '../functions/sanitize_html_output.js';

async function handler(filePath, config) {
  const contentDir = utils.normalizeDir(path.normalize(config.content_dir));

  try {
    const file = await fs.readFile(filePath, 'utf8');
    let slug = utils.getSlug(filePath, contentDir);

    if (slug.includes('index.md')) {
      slug = slug.replace('index.md', '');
    }
    slug = slug.replace('.md', '').trim();

    const meta = content_processors.processMeta(file);
    const content = content_processors.processVars(
      content_processors.stripMeta(file),
      config,
    );

    const body = sanitizeHtmlOutput(marked(content));
    const title = meta.title
      ? meta.title
      : content_processors.slugToTitle(slug);
    const cleanText = _.unescape(
      sanitizeHtml(body, { allowedTags: [], allowedAttributes: {} }),
    );
    const maxLength = config.excerpt_length || 400;
    const excerpt =
      cleanText.length > maxLength
        ? cleanText.slice(0, maxLength).trimEnd().replace(/\S*$/, '') + '...'
        : cleanText;

    return {
      slug,
      title,
      body,
      excerpt,
    };
  } catch (e) {
    if (config.debug) {
      console.log(e);
    }
    return null;
  }
}

export default handler;
