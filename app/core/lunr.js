// Modules
import lunr from 'lunr';
import lunr_stemmer from 'lunr-languages/lunr.stemmer.support.js';
import lunr_multi from 'lunr-languages/lunr.multi.js';
import lunr_tinyseg from 'lunr-languages/tinyseg.js';
// Languages
import lunr_da from 'lunr-languages/lunr.da.js';
import lunr_de from 'lunr-languages/lunr.de.js';
import lunr_es from 'lunr-languages/lunr.es.js';
import lunr_fi from 'lunr-languages/lunr.fi.js';
import lunr_fr from 'lunr-languages/lunr.fr.js';
import lunr_hu from 'lunr-languages/lunr.hu.js';
import lunr_ja from 'lunr-languages/lunr.ja.js';
import lunr_no from 'lunr-languages/lunr.no.js';
import lunr_pt from 'lunr-languages/lunr.pt.js';
import lunr_ro from 'lunr-languages/lunr.ro.js';
import lunr_ru from 'lunr-languages/lunr.ru.js';
import lunr_sv from 'lunr-languages/lunr.sv.js';
import lunr_tr from 'lunr-languages/lunr.tr.js';
// Chinese (zh) requires @node-rs/jieba — add lunr_zh if that package is installed

const languageLoaders = {
  da: lunr_da,
  de: lunr_de,
  es: lunr_es,
  fi: lunr_fi,
  fr: lunr_fr,
  hu: lunr_hu,
  ja: lunr_ja,
  no: lunr_no,
  pt: lunr_pt,
  ro: lunr_ro,
  ru: lunr_ru,
  sv: lunr_sv,
  tr: lunr_tr,
};

let instance = null;
let stemmers = null;

function getLunr(config) {
  if (instance === null) {
    instance = lunr;
    lunr_stemmer(instance);
    lunr_multi(instance);
    lunr_tinyseg(instance);
    config.searchExtraLanguages.forEach((lang) => {
      if (languageLoaders[lang]) {
        languageLoaders[lang](instance);
      }
    });
  }
  return instance;
}

function getStemmers(config) {
  if (stemmers === null) {
    const languages = ['en'].concat(config.searchExtraLanguages);
    stemmers = getLunr(config).multiLanguage(...languages);
  }
  return stemmers;
}

export default {
  getLunr,
  getStemmers,
};
