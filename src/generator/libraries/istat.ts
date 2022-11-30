import { IExtendedOption, IOption, LibraryConfig } from '../../types';
import { getRemoteXlsl } from '../xlsl';

let ISTAT: IExtendedOption[] | null = null;

async function getIstat(): Promise<IExtendedOption[]> {
  if (ISTAT) {
    return ISTAT;
  }
  const json = await getRemoteXlsl('https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.xlsx');
  if (!json) {
    throw 'getIstat.error';
  }
  ISTAT = istatMapper(json);
  return ISTAT;
}

function istatMapper(items: any[]): IExtendedOption[] {
  return items.map(item => ({
    id: item['Codice Comune formato alfanumerico'].toString(),
    name: item['Denominazione in italiano'],
    code: item['Codice Catastale del comune'].toString(),
    countryZone: {
      id: item['Codice Ripartizione Geografica'].toString(),
      name: item['Ripartizione geografica'],
    },
    region: {
      id: item['Codice Regione'].toString(),
      name: item['Denominazione Regione'],
    },
    province: {
      id: item['Codice dell\'Unità territoriale sovracomunale \r\n(valida a fini statistici)'].toString(),
      name: item['Denominazione dell\'Unità territoriale sovracomunale \r\n(valida a fini statistici)'],
      code: item['Sigla automobilistica'].toString(),
    },
  }));
  /*
  {
    'Codice Regione': '01',
    "Codice dell'Unità territoriale sovracomunale \n(valida a fini statistici)": 201,
    'Codice Provincia (Storico)(1)': '001',
    'Progressivo del Comune (2)': 101,
    'Codice Comune formato alfanumerico': '001101',
    'Denominazione (Italiana e straniera)': 'Favria',
    'Denominazione in italiano': 'Favria',
    'Denominazione altra lingua': '',
    'Codice Ripartizione Geografica': 1,
    'Ripartizione geografica': 'Nord-ovest',
    'Denominazione Regione': 'Piemonte',
    "Denominazione dell'Unità territoriale sovracomunale \n(valida a fini statistici)": 'Torino',
    'Tipologia di Unità territoriale sovracomunale ': 3,
    'Flag Comune capoluogo di provincia/città metropolitana/libero consorzio': 0,
    'Sigla automobilistica': 'TO',
    'Codice Comune formato numerico': 1101,
    'Codice Comune numerico con 110 province (dal 2010 al 2016)': 1101,
    'Codice Comune numerico con 107 province (dal 2006 al 2009)': 1101,
    'Codice Comune numerico con 103 province (dal 1995 al 2005)': 1101,
    'Codice Catastale del comune': 'D520',
    'Codice NUTS1 2010': 'ITC',
    'Codice NUTS2 2010 (3) ': 'ITC1',
    'Codice NUTS3 2010': 'ITC11',
    'Codice NUTS1 2021': 'ITC',
    'Codice NUTS2 2021 (3) ': 'ITC1',
    'Codice NUTS3 2021\r': 'ITC11\r'
  }
  */
}

export const countryZone: LibraryConfig = {
  id: 'countryZone',
  name: 'Elenco-comuni-italiani.csv',
  generator: async () => {
    const istat = await getIstat();
    const countryZones: IOption[] = [];
    istat.forEach(x => {
      if (!countryZones.find(r => r.id === x.countryZone.id)) {
        countryZones.push({
          ...x.countryZone,
        });
      }
    });
    // sortByName(countryZones);
    // console.log('countryZones', countryZones[0]);
    return countryZones;
  }
};

export const region: LibraryConfig = {
  id: 'region',
  name: 'Elenco-comuni-italiani.csv',
  generator: async () => {
    const istat = await getIstat();
    const regions: IOption[] = [];
    istat.forEach(x => {
      if (!regions.find(r => r.id === x.region.id)) {
        regions.push({
          ...x.region,
          countryZone: x.countryZone.id,
        });
      }
    });
    // sortByName(regions);
    // console.log('regions', regions[0]);
    return regions;
  }
};

export const province: LibraryConfig = {
  id: 'province',
  name: 'Elenco-comuni-italiani.csv',
  generator: async () => {
    const istat = await getIstat();
    const provinces: IExtendedOption[] = [];
    istat.forEach(x => {
      if (!provinces.find(p => p.id === x.province.id)) {
        provinces.push({
          ...x.province,
          countryZone: x.countryZone.id,
          region: x.region.id,
        });
      }
    });
    // sortByName(provinces);
    // console.log('provinces', provinces[0]);
    return provinces;
  }
}

export const municipality: LibraryConfig = {
  id: 'municipality',
  name: 'Elenco-comuni-italiani.csv',
  generator: async () => {
    const istat = await getIstat();
    const municipalities = istat.map(x => ({
      id: x.id,
      name: x.name,
      code: x.code,
      countryZone: x.countryZone.id,
      region: x.region.id,
      province: x.province.id,
    }));
    // sortByName(municipalities);
    // console.log('municipalities', municipalities[0]);
    return municipalities;
  }
}

/**
 * reference
 * https://www.istat.it/it/archivio/6789
 * permalink https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv
 * todo comuni caps -> https://github.com/matteocontrini/comuni-json
 */
