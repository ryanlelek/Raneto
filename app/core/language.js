// Modules
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function languageLoad(localeCode) {
  // Path is relative to this module's location
  return JSON.parse(
    readFileSync(
      path.join(__dirname, '..', 'translations', localeCode + '.json'),
      'utf8',
    ),
  );
}

export default languageLoad;
