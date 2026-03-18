// Sanitize Markdown content
// Normalizes line endings to ensure consistent storage
function sanitizeMarkdown(str) {
  return str.replaceAll(/\r\n/g, '\n').replaceAll(/\r/g, '\n');
}

// Exports
export default sanitizeMarkdown;
