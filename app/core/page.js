import path from 'node:path';
import fs from 'fs-extra';
import _s from 'underscore.string';
import { marked } from 'marked';
import utils from './utils.js';
import content_processors from '../functions/content_processors.js';

async function handler(filePath, config) {
  const contentDir = utils.normalizeDir(path.normalize(config.content_dir));

  try {
    const file = await fs.readFile(filePath);
    let slug = utils.getSlug(filePath, contentDir);

    if (slug.indexOf('index.md') > -1) {
      slug = slug.replace('index.md', '');
    }
    slug = slug.replace('.md', '').trim();

    const meta = content_processors.processMeta(file.toString('utf-8'));
    const content = content_processors.processVars(
      content_processors.stripMeta(file.toString('utf-8')),
      config,
    );

    // Render Markdown
    marked.use({
      // Removed in v8.x
      // https://github.com/markedjs/marked/releases/tag/v8.0.0
      // mangle: false,
      // headerIds: false,
    });
    const body = marked(content);
    const title = meta.title
      ? meta.title
      : content_processors.slugToTitle(slug);
    const excerpt = _s.prune(
      _s.stripTags(_s.unescapeHTML(body)),
      config.excerpt_length || 400,
    );

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
