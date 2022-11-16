
import nationalitiesI18N from 'i18n-nationality';
import nationalitiesI18NIt from 'i18n-nationality/langs/it.json';
import { availableLocales } from '../../config';
import { ILocalizedOption, ILocalizedString, IOption, LibraryConfig } from '../../types';
import { isoKeyMapper } from '../utils';
nationalitiesI18N.registerLocale(nationalitiesI18NIt);

export const nationality: LibraryConfig = {
  id: 'nationality',
  name: 'i18n-nationality',
  localized: true,
  generator: async () => {
    const nationalities = getLocalizedNationalities();
    return nationalities;
  }
};

function getLocalizedNationalities(): ILocalizedOption[] {
  const items = getNationalities('en');
  const localizedItems: ILocalizedOption[] = items.map(x => ({
    ...x,
    name: { en: x.name } as ILocalizedString,
    englishName: x.name as string,
  }));
  for (const locale of availableLocales) {
    if (locale !== 'en') {
      const others = getNationalities(locale);
      localizedItems.forEach(x => {
        (x.name as ILocalizedString)[locale] = others.find(o => o.id === x.id)?.name as string;
      });
    }
  }
  return localizedItems;
}

function getNationalities(locale: string): IOption[] {
  const nationalitiesI18NLocale = require(`i18n-nationality/langs/${locale}.json`);
  nationalitiesI18N.registerLocale(nationalitiesI18NLocale);
  const names = nationalitiesI18N.getNames(locale);
  // console.log('i18n-nationality', names.IT);
  const languages = isoKeyMapper(names);
  return languages;
}
