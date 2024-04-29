// Modules
import fs from 'fs-extra';
import get_filepath from '../functions/get_filepath.js';
import create_meta_info from '../functions/create_meta_info.js';
import sanitize_markdown from '../functions/sanitize_markdown.js';

function route_page_edit(config) {
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

    // Generate Filepath
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

    // Create content including meta information (i.e. title, description, sort)
    function create_content(body) {
      const meta = create_meta_info(
        body.meta_title,
        body.meta_description,
        body.meta_sort,
      );
      return meta + body.content;
    }

    const complete_content = create_content(req.body);
    const sanitized_content = sanitize_markdown(complete_content);

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
