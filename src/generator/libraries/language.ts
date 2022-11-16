
import languagesI18N from '@cospired/i18n-iso-languages';
import languagesI18NIt from '@cospired/i18n-iso-languages/langs/it.json';
import * as countriesList from 'countries-list';
import { IExtendedOption, IOption } from '../../types';
import { capitalizeFirstLetter, isoKeyMapper } from '../utils';
languagesI18N.registerLocale(languagesI18NIt);

export const language = {
  id: 'language',
  name: '@cospired/i18n-iso-languages',
  localized: true,
  generator: async (locale: string) => {
    const languages = getLanguages(locale);
    const extendedLanguages = extendLanguages(languages);
    return extendedLanguages;
  }
}

function getLanguages(locale: string): IOption[] {
  const languagesI18NLocale = require(`@cospired/i18n-iso-languages/langs/${locale}.json`);
  languagesI18N.registerLocale(languagesI18NLocale);
  const names = languagesI18N.getNames(locale);
  // console.log('@cospired/i18n-iso-languages', names.it);
  const languages = isoKeyMapper(names);
  languages.forEach(x => x.name = capitalizeFirstLetter(x.name));
  return languages;
}

function extendLanguages(items: IOption[]): IExtendedOption[] {
  const extendedItems: IExtendedOption[] = items.map(x => {
    const item: IExtendedOption = { ...x };
    const clKey: keyof typeof countriesList.languages = item.id as keyof typeof countriesList.languages;
    const clLanguage: countriesList.Language = countriesList.languages[clKey] || null;
    if (clLanguage) {
      item.nativeName = clLanguage.native;
      if (clLanguage.rtl) {
        item.rtl = clLanguage.rtl;
      }
    } else {
      console.warn(`language.extendLanguages code not found ${item.id} - ${item.name}`);
    }
    return item;
  });
  return extendedItems;
}
