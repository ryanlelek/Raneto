// Modules
import fs from 'fs-extra';
import getFilepath, {
  resolveFilepath,
  parseFileParam,
} from '../functions/getFilepath.js';

function routePageDelete(config) {
  return async function (req, res) {
    const parsed = parseFileParam(req.body.file);
    if (!parsed) {
      return res.json({
        status: 1,
        message: config.lang.api.invalidFile || 'Invalid file path',
      });
    }

    // Generate filepath
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

    try {
      // Don't Delete
      // Rename to remove from listing
      await fs.rename(filepath, `${filepath}.del`);

      res.json({
        status: 0,
        message: config.lang.api.pageDeleted,
      });
    } catch (error) {
      console.error('Page delete error:', error.message);
      res.json({
        status: 1,
        message: config.lang.api.pageNotDeleted || 'An error occurred',
      });
    }
  };
}

// Exports
export default routePageDelete;
