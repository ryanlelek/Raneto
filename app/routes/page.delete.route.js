// Modules
import fs from 'fs-extra';
import getFilepath, {
  resolveFilepath,
  parseFileParam,
} from '../functions/get_filepath.js';

function route_page_delete(config) {
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
      res.json({
        status: 1,
        message: error.message,
      });
    }
  };
}

// Exports
export default route_page_delete;
