import * as countriesList from 'countries-list';
import i18nCountries from 'i18n-iso-countries';
import i18nCountriesIt from 'i18n-iso-countries/langs/it.json';
import iso3166Countries from '../../../data/iso-3166-countries.json';
import { availableLocales } from '../../config';
import { IExtendedLocalizedOption, ILocalizedOption, ILocalizedString, IOption, LibraryConfig } from '../../types';
import { isoKeyMapper } from '../utils';
// "iso-3166-countries": "https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes#master",
i18nCountries.registerLocale(i18nCountriesIt);

let COUNTRIES: IExtendedLocalizedOption[] | null = null;

export const continent: LibraryConfig = {
  id: 'continent',
  name: 'i18n-iso-countries',
  generator: async () => {
    const items = getExtendedCountries();
    const continents: IOption[] = [];
    items.forEach(x => {
      if (!continents.find(c => c.id === x.continent.id)) {
        continents.push({
          ...x.continent,
        });
      }
    });
    // console.log('continents', continents[0]);
    return continents;
  }
}

export const subContinent: LibraryConfig = {
  id: 'subContinent',
  name: 'i18n-iso-countries',
  generator: async () => {
    const items = getExtendedCountries();
    const subContinents: IOption[] = [];
    items.forEach(x => {
      if (!subContinents.find(c => c.id === x.subContinent.id)) {
        subContinents.push({
          ...x.subContinent,
          continent: x.continent.id,
        });
      }
    });
    // console.log('subContinents', subContinents[0]);
    return subContinents;
  }
}

export const country: LibraryConfig = {
  id: 'country',
  name: 'i18n-iso-countries',
  localized: true,
  generator: async () => {
    const items = getExtendedCountries();
    const countries: IExtendedLocalizedOption[] = items.map(x => {
      const country: IExtendedLocalizedOption = {
        ...x,
        continent: x.continent.id,
        subContinent: x.subContinent.id,
      };
      return country;
    });
    // sortByName(countries);
    // console.log('countries', countries[0]);
    return countries;
  }
}

function getExtendedCountries(): IExtendedLocalizedOption[] {
  if (COUNTRIES) {
    return COUNTRIES;
  }
  const countries = getLocalizedCountries();
  COUNTRIES = extendCountries(countries);
  return COUNTRIES;
}

function getLocalizedCountries(): ILocalizedOption[] {
  const items = getCountries('en');
  const localizedItems: ILocalizedOption[] = items.map(x => ({
    ...x,
    name: { en: x.name } as ILocalizedString,
    englishName: x.name as string,
  }));
  for (const locale of availableLocales) {
    if (locale !== 'en') {
      const others = getCountries(locale);
      localizedItems.forEach(x => {
        (x.name as ILocalizedString)[locale] = others.find(o => o.id === x.id)?.name as string;
      });
    }
  }
  return localizedItems;
}

function getCountries(locale: string): IOption[] {
  const i18nCountriesLocale = require(`i18n-iso-countries/langs/${locale}.json`);
  i18nCountries.registerLocale(i18nCountriesLocale);
  const names = i18nCountries.getNames(locale);
  // console.log('i18n-iso-countries', names.IT);
  // console.log(countriesList.countries.IT);
  const countries = isoKeyMapper(names);
  return countries;
}

function extendCountries(items: ILocalizedOption[]): IExtendedLocalizedOption[] {
  const extendedItems: IExtendedLocalizedOption[] = items.map(x => {
    const item: IExtendedLocalizedOption = { ...x };
    const isoCountry: any = iso3166Countries.find(x => x['alpha-2'].toLowerCase() === item.id);
    if (isoCountry) {
      item.englishName = isoCountry['name'];
      item.alpha2Code = isoCountry['alpha-2'].toLowerCase();
      item.alpha3Code = isoCountry['alpha-3'].toLowerCase();
      item.countryCode = parseInt(isoCountry['country-code']).toString();
      item.isoCode = isoCountry['iso_3166-2'];
      if (!isoCountry['region-code']) {
        console.log(`country.extendCountries continent not found ${item.id} - ${item.englishName}`);
      }
      item.continent = {
        id: parseInt(isoCountry['region-code']).toString(),
        name: isoCountry['region'],
      };
      item.subContinent = {
        id: parseInt(isoCountry['sub-region-code']).toString(),
        name: isoCountry['sub-region'],
      };
      switch (item.id) {
        case 'aq':
          item.continent = {
            id: '999',
            name: 'Antarctica',
          };
          item.subContinent = {
            id: '999',
            name: 'Antarctica',
          };
          break;
        case 'xk':
          item.continent = {
            id: '150',
            name: 'Europe',
          };
          item.subContinent = {
            id: '151',
            name: 'Eastern Europe',
          };
          break;
      }
      if (isoCountry['intermediate-region-code']) {
        item.intermediateRegion = {
          id: parseInt(isoCountry['intermediate-region-code']).toString(),
          name: isoCountry['intermediate-region'],
        };
      }
    } else {
      console.warn(`country.extendCountries code not found ${item.id} - ${item.englishName}`);
    }
    const clKey: keyof typeof countriesList.countries = item.id.toUpperCase() as keyof typeof countriesList.countries;
    const clCountry: countriesList.Country = countriesList.countries[clKey] || null;
    if (clCountry) {
      item.nativeName = clCountry.native;
      item.capitalName = clCountry.capital;
      item.continentCode = clCountry.continent.toLowerCase();
      item.currencies = Array.isArray(clCountry.currency) ? clCountry.currency : (clCountry.currency.indexOf(',') !== -1 ? clCountry.currency.split(',') : [clCountry.currency]);
      item.languages = Array.isArray(clCountry.languages) ? clCountry.languages : [clCountry.languages];
      item.internationalPrefixes = Array.isArray(clCountry.phone) ? clCountry.phone : (clCountry.phone.indexOf(',') !== -1 ? clCountry.phone.split(',') : [clCountry.phone]);
      item.emoji = clCountry.emoji;
      item.emojiU = clCountry.emojiU;
    } else {
      console.warn(`country.extendCountries code not found ${item.id} - ${item.englishName}`);
    }
    return item;
  });
  return extendedItems.filter(x => x.continent != null);
}
