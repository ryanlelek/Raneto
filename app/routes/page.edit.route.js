// Modules
import fs from 'fs-extra';
import get_filepath from '../functions/get_filepath.js';
import create_meta_info from '../functions/create_meta_info.js';
import sanitize_markdown from '../functions/sanitize_markdown.js';

function route_page_edit(config) {
  return async function (req, res) {
    // Check if file parameter exists and is not empty
    if (!req.body.file || req.body.file.trim() === '') {
      return res.json({
        status: 1,
        message: config.lang.api.invalidFile || 'Invalid file path',
      });
    }

    let file_category = '';
    let file_name = '';

    // Handle category in file path
    const req_file = req.body.file.split('/');
    if (req_file.length > 1) {
      file_category = req_file[0];
      file_name = req_file[1];
    } else if (req_file.length === 1) {
      file_name = req_file[0];
    } else {
      return res.json({
        status: 1,
        message: config.lang.api.invalidFile || 'Invalid file path',
      });
    }

    // Generate Filepath
    // Sanitized within function
    let filepath = get_filepath({
      content: config.content_dir,
      category: file_category,
      filename: file_name,
    });

    if (!filepath) {
      return res.json({
        status: 1,
        message: config.lang.api.invalidFile || 'Invalid file path',
      });
    }

    // No file at that filepath?
    // Add ".md" extension to try again
    if (!(await fs.pathExists(filepath))) {
      filepath += '.md';
    }

    // Create content with metadata header and sanitized body
    const meta = create_meta_info(
      req.body.meta_title,
      req.body.meta_description,
      req.body.meta_sort,
    );
    const sanitized_content = meta + sanitize_markdown(req.body.content);

    try {
      await fs.writeFile(filepath, sanitized_content);

      res.json({
        status: 0,
        message: config.lang.api.pageSaved,
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
export default route_page_edit;
