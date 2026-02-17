// Modules
import yaml from 'js-yaml';

// Returns an empty string if all input strings are empty
function createMetaInfo(metaTitle, metaDescription, metaSort) {
  const yamlDocument = {};
  const metaInfoIsPresent = metaTitle || metaDescription || metaSort;

  if (metaInfoIsPresent) {
    if (metaTitle) {
      yamlDocument.Title = metaTitle;
    }
    if (metaDescription) {
      yamlDocument.Description = metaDescription;
    }
    if (metaSort) {
      yamlDocument.Sort = parseInt(metaSort, 10);
    }

    return `---\n${yaml.dump(yamlDocument)}---\n`;
  }
  return '---\n---\n';
}

// Exports
export default createMetaInfo;
