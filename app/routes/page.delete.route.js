// Modules
import fs from 'fs-extra';
import get_filepath from '../functions/get_filepath.js';

function route_page_delete(config) {
  return async function (req, res) {
    let file_category = '';
    let file_name = '';

    // Handle category in file path
    const req_file = req.body.file.split('/');
    if (req_file.length > 2) {
      file_category = req_file[1];
      file_name = req_file[2];
    } else {
      file_name = req_file[1];
    }

    // Generate filepath
    // Sanitized within function
    let filepath = get_filepath({
      content: config.content_dir,
      category: file_category,
      filename: file_name,
    });

    // No file at that filepath?
    // Add ".md" extension to try again
    if (!(await fs.pathExists(filepath))) {
      filepath += '.md';
    }

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
        message: error,
      });
    }
  };
}

// Exports
export default route_page_delete;
