// Modules
import fs from 'fs-extra';
import getFilepath, {
  resolveFilepath,
  parseFileParam,
} from '../functions/get_filepath.js';
import createMetaInfo from '../functions/create_meta_info.js';
import sanitizeMarkdown from '../functions/sanitize_markdown.js';

function routePageEdit(config) {
  return async function (req, res) {
    const parsed = parseFileParam(req.body.file);
    if (!parsed) {
      return res.json({
        status: 1,
        message: config.lang.api.invalidFile || 'Invalid file path',
      });
    }

    // Generate Filepath
    // Sanitized within function
    let filepath = getFilepath({
      content: config.content_dir,
      category: parsed.category,
      filename: parsed.filename,
    });

    if (!filepath) {
      return res.json({
        status: 1,
        message: config.lang.api.invalidFile || 'Invalid file path',
      });
    }

    filepath = await resolveFilepath(filepath);

    // Create content with metadata header and sanitized body
    const meta = createMetaInfo(
      req.body.meta_title,
      req.body.meta_description,
      req.body.meta_sort,
    );
    const sanitizedContent = meta + sanitizeMarkdown(req.body.content);

    try {
      await fs.writeFile(filepath, sanitizedContent);

      res.json({
        status: 0,
        message: config.lang.api.pageSaved,
      });
    } catch (error) {
      console.error('Page edit error:', error.message);
      res.json({
        status: 1,
        message: config.lang.api.pageNotSaved || 'An error occurred',
      });
    }
  };
}

// Exports
export default routePageEdit;
