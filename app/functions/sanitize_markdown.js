// Sanitize Markdown content
// Removes problematic characters not in the Markdown spec
// https://www.markdownguide.org/cheat-sheet/
function sanitize_markdown(str) {
  return str.replace(/</g, '&lt;').replace(/(\s)&(\s)/g, ' &amp; ');
}

// Exports
export default sanitize_markdown;
