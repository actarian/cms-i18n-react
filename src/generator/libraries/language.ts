
import languagesI18N from '@cospired/i18n-iso-languages';
import languagesI18NIt from '@cospired/i18n-iso-languages/langs/it.json';
import * as countriesList from 'countries-list';
import { availableLocales } from '../../config';
import { IExtendedLocalizedOption, ILocalizedOption, ILocalizedString, IOption, LibraryConfig } from '../../types';
import { capitalizeFirstLetter, isoKeyMapper } from '../utils';
languagesI18N.registerLocale(languagesI18NIt);

export const language: LibraryConfig = {
  id: 'language',
  name: '@cospired/i18n-iso-languages',
  localized: true,
  generator: async () => {
    const languages = getLocalizedLanguages();
    const extendedLanguages = extendLanguages(languages);
    return extendedLanguages;
  }
}

function getLocalizedLanguages(): ILocalizedOption[] {
  const items = getLanguages('en');
  const localizedItems: ILocalizedOption[] = items.map(x => ({
    ...x,
    name: { en: x.name } as ILocalizedString,
    englishName: x.name as string,
  }));
  for (const locale of availableLocales) {
    if (locale !== 'en') {
      const others = getLanguages(locale);
      localizedItems.forEach(x => {
        (x.name as ILocalizedString)[locale] = others.find(o => o.id === x.id)?.name as string;
      });
    }
  }
  return localizedItems;
}

function getLanguages(locale: string): IOption[] {
  const languagesI18NLocale = require(`@cospired/i18n-iso-languages/langs/${locale}.json`);
  languagesI18N.registerLocale(languagesI18NLocale);
  const names = languagesI18N.getNames(locale);
  // console.log('@cospired/i18n-iso-languages', names.it);
  const languages = isoKeyMapper(names);
  languages.forEach(x => x.name = capitalizeFirstLetter(x.name as string));
  return languages;
}

function extendLanguages(items: ILocalizedOption[]): IExtendedLocalizedOption[] {
  const extendedItems: IExtendedLocalizedOption[] = items.map(x => {
    const item: IExtendedLocalizedOption = { ...x };
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
