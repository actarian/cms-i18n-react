
import comuniData from 'comuni-province-regioni-italia/assets/json/comuni.json';
import provinceData from 'comuni-province-regioni-italia/assets/json/province.json';
import regioniData from 'comuni-province-regioni-italia/assets/json/regioni.json';
import { LibraryConfig } from '../../types';
import { sortByName } from '../utils';

export const region: LibraryConfig = {
  id: 'region',
  name: 'comuni-province-regioni-italia',
  generator: async () => {
    // console.log('comuni-province-regioni-italia/regioni', regioni[0]);
    const regions = regioniData.map(x => ({
      id: x.id.toLowerCase(),
      name: x.nome,
      position: {
        latitude: x.latitudine,
        longitude: x.longitudine,
      },
    }));
    sortByName(regions);
    // "id": "13", "nome": "Abruzzo", "latitudine": 42.354008, "longitudine": 13.391992, "name": "Abruzzo"
    return regions;
  }
};

export const province: LibraryConfig = {
  id: 'province',
  name: 'comuni-province-regioni-italia',
  generator: async () => {
    // console.log('comuni-province-regioni-italia/province', province[0]);
    const provinces = provinceData.map(x => ({
      id: x.sigla.toLowerCase(),
      name: x.nome,
      code: x.sigla,
      region: x.regione,
    }));
    sortByName(provinces);
    // "nome": "Agrigento", "sigla": "AG", "regione": "Sicilia", "id": "ag", "name": "Agrigento"
    return provinces;
  }
}

export const municipality: LibraryConfig = {
  id: 'municipality',
  name: 'comuni-province-regioni-italia',
  generator: async () => {
    // console.log('comuni-province-regioni-italia/comuni', comuni[0]);
    const items = comuniData.map((x, i) => ({ ...x, id: '', name: x.nome }));
    sortByName(items);
    const municipalities = items.map((x, i) => ({
      id: x.codiceCatastale, // String(i + 1).padStart(7, '0'),
      name: x.name,
      region: parseInt(x.regione.codice).toString(),
      province: parseInt(x.provincia.codice).toString(),
      provinceCode: x.sigla,
      // landRegisterCode: x.codiceCatastale,
      zipCodes: x.cap,
      populationCount: x.popolazione,
      zone: {
        id: parseInt(x.zona.codice).toString(),
        name: x.zona.nome,
      },
    }));
    sortByName(municipalities);
    return municipalities;
  }
}
