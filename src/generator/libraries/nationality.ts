
import nationalitiesI18N from 'i18n-nationality';
import nationalitiesI18NIt from 'i18n-nationality/langs/it.json';
import { isoKeyMapper } from '../utils';
nationalitiesI18N.registerLocale(nationalitiesI18NIt);

export const language = {
  id: 'nationality',
  name: 'i18n-nationality',
  localized: true,
  generator: async (locale: string) => {
    const nationalitiesI18NLocale = require(`i18n-nationality/langs/${locale}.json`);
    nationalitiesI18N.registerLocale(nationalitiesI18NLocale);
    const names = nationalitiesI18N.getNames(locale);
    // console.log('i18n-nationality', names.IT);
    return isoKeyMapper(names);
  }
};
