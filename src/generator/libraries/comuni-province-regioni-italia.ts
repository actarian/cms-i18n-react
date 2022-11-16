
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
      regionId: x.regione,
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
      regionId: parseInt(x.regione.codice).toString(),
      /*
      region: {
        id: parseInt(x.regione.codice).toString(),
        name: x.regione.nome,
      },
      */
      provinceId: parseInt(x.provincia.codice).toString(),
      provinceCode: x.sigla,
      /*
      province: {
        id: parseInt(x.provincia.codice).toString(),
        name: x.provincia.nome,
        code: x.sigla,
      },
      */
      // landRegisterCode: x.codiceCatastale,
      zipCodes: x.cap,
      populationCount: x.popolazione,
      zone: {
        id: parseInt(x.zona.codice).toString(),
        name: x.zona.nome,
      },
    }));
    sortByName(municipalities);
    // "nome": "Abano Terme", "codice": "028001", "zona": { "codice": "2", "nome": "Nord-est" }, "regione": { "codice": "05", "nome": "Veneto" },
    // "provincia": { "codice": "028", "nome": "Padova" }, "sigla": "PD", "codiceCatastale": "A001", "cap": [ "35031" ], "popolazione": 19349, "id": "000001", "name": "Abano Terme"
    return municipalities;
  }
}
