// Modules
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function language_load(locale_code) {
  // Path is relative to this module's location
  const lang_json = JSON.parse(
    readFileSync(
      path.join(__dirname, '..', 'translations', locale_code + '.json'),
    ),
  );
  return lang_json;
}

export default language_load;
