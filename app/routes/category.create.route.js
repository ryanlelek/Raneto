// Modules
import fs from 'node:fs';
import get_filepath from '../functions/get_filepath.js';

function route_category_create(config) {
  return function (req, res) {
    // Generate filepath
    // Sanitized within function
    const filepath = get_filepath({
      content: config.content_dir,
      category: req.body.category,
    });

    fs.mkdir(filepath, (error) => {
      if (error) {
        return res.json({
          status: 1,
          message: error,
        });
      }
      res.json({
        status: 0,
        message: config.lang.api.categoryCreated,
      });
    });
  };
}

// Exports
export default route_category_create;
