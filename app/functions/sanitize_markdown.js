
// Modules
// var validator = require('validator');

// Sanitize Content
// This will disallow <script> and <style> embeds
// because output will be HTML-encoded.
// If you need images, links, etc. use the Markdown format (see docs)
//
// This was the prior content sanitizer, which was too aggressive
// Markdown characters got encoded/escaped to the point of being unusable
// return validator.escape(str);
//
// Instead we now will remove problematic characters not in the Markdown spec
// https://www.markdownguide.org/cheat-sheet/
// Includes: >, &
// More may be added in the future
// Additionally, Content Security Policy when implemented will help

// TODO: Add Test
function sanitize_markdown(str) {
  return str
    .replace(/</g, '&lt;')
    .replace(/(\s)&(\s)/g, ' &amp; ');
}

// Exports
module.exports = exports = sanitize_markdown;
