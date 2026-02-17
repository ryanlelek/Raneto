// Sanitize Markdown content
// Normalizes line endings to ensure consistent storage
function sanitizeMarkdown(str) {
  return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

// Exports
export default sanitizeMarkdown;
