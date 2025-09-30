import 'fs';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
  // Ensure locale is a valid language code
  const validLocale = locale && dictionaries[locale] ? locale : 'en';
  return dictionaries[validLocale]();
};