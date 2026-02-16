// Modules
import fs from 'fs-extra';
import getFilepath from '../functions/get_filepath.js';

function route_category_create(config) {
  return async function (req, res) {
    // Generate filepath
    // Sanitized within function
    const filepath = getFilepath({
      content: config.content_dir,
      category: req.body.category,
    });

    if (!filepath) {
      return res.json({
        status: 1,
        message: config.lang.api.invalidCategory || 'Invalid category path',
      });
    }

    try {
      await fs.mkdir(filepath);
      res.json({
        status: 0,
        message: config.lang.api.categoryCreated,
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
export default route_category_create;
