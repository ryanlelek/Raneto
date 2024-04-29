// Modules
import lunr from 'lunr';
import lunr_stemmer from 'lunr-languages/lunr.stemmer.support.js';
import lunr_multi from 'lunr-languages/lunr.multi.js';
import lunr_tinyseg from 'lunr-languages/tinyseg.js';
// Languages
import lunr_ru from 'lunr-languages/lunr.ru.js';
// TODO: Add more languages, "ru" was the only found config for "searchExtraLanguages"

let instance = null;
let stemmers = null;

function getLunr(config) {
  if (instance === null) {
    instance = lunr;
    lunr_stemmer(instance);
    lunr_multi(instance);
    lunr_tinyseg(instance);
    config.searchExtraLanguages.forEach((lang) => {
      if (lang === 'ru') {
        lunr_ru(instance);
      }
    });
  }
  return instance;
}

function getStemmers(config) {
  if (stemmers === null) {
    const languages = ['en'].concat(config.searchExtraLanguages);
    stemmers = getLunr(config).multiLanguage.apply(null, languages);
  }
  return stemmers;
}

export default {
  getLunr,
  getStemmers,
};
