// Normalizes line endings to ensure consistent storage
function normalizeLineEndings(str) {
  return str.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
}

// Exports
export default normalizeLineEndings;
