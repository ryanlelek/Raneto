// Modules
import { readFileSync } from 'node:fs';
import path from 'node:path';

function language_load(locale_code) {
  // Path is relative to current working directory
  const lang_json = JSON.parse(
    readFileSync(path.join('app', 'translations', locale_code + '.json')),
  );
  return lang_json;
}

export default language_load;
