// Modules
import fs from 'fs-extra';
import getFilepath from '../functions/get_filepath.js';

function route_page_create(config) {
  return async function (req, res) {
    // Generate filepath
    // Sanitized within function
    const filepath = getFilepath({
      content: config.content_dir,
      category: req.body.category,
      filename: `${req.body.name}.md`,
    });

    if (!filepath) {
      return res.json({
        status: 1,
        message: config.lang.api.invalidFile || 'Invalid file path',
      });
    }

    try {
      await fs.ensureFile(filepath);
      res.json({
        status: 0,
        message: config.lang.api.pageCreated,
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
export default route_page_create;
