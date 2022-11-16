import { availableLocales } from '../config';
import { Library, LibraryConfig } from '../types';
import { continent } from './libraries/continent';
import { country } from './libraries/country';
import { geographicRegion, municipality, province, region } from './libraries/istat';
import { language } from './libraries/language';
// const pluralize = require('pluralize');

const config = [
  language,
  // nationality,
  continent,
  country,
  geographicRegion,
  region,
  province,
  municipality,
];

async function getLibraries(configs: LibraryConfig[], locale: string = 'it', first?: boolean): Promise<Library[]> {

  const libraries: Library[] = [];

  for (const config of configs) {
    const library: Library = {
      id: config.id,
      name: config.name,
      localized: config.localized,
      items: [],
    };
    if (library.localized || first) {
      library.items = await config.generator(locale);
    }
    libraries.push(library);
  }

  const language = libraries.find(x => x.id === 'language');
  if (language) {
    language.items = language.items.filter(x => availableLocales.includes(x.id));
  }
  // const nationality = libraries.find(x => x.id === 'nationality');
  const country = libraries.find(x => x.id === 'country');
  /*
  country?.items.forEach((x: any) => {
    x.nationality = nationality?.items.find(l => l.id === x.id);
  });
  */
  const italy = country?.items.find(x => x.id === 'it');
  if (italy) {
    const region = libraries.find(x => x.id === 'region');
    region?.items.forEach((x: any) => {
      x.countryId = italy.id;
    });
    const province = libraries.find(x => x.id === 'province');
    province?.items.forEach((x: any) => {
      x.countryId = italy.id;
    });
    const municipality = libraries.find(x => x.id === 'municipality');
    municipality?.items.forEach((x: any) => {
      x.countryId = italy.id;
    });
  }
  return libraries;
}

export function getLibrariesFromLocale(locale: string, first?: boolean): Promise<Library[]> {
  return getLibraries(config, locale, first);
}

/**
 * reference api
 * https://www.npmjs.com/package/geonames.js
 * https://www.npmjs.com/package/countryjs
 * https://www.npmjs.com/package/@types/provinces
 * https://www.npmjs.com/package/countries-states-data
 */