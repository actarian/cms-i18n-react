import * as countriesList from 'countries-list';
import { LibraryConfig } from '../../types';
import { isoKeyMapper } from '../utils';

export const continent: LibraryConfig = {
  id: 'continent',
  name: 'countries-list',
  generator: async () => {
    const continent = isoKeyMapper(countriesList.continents);
    return continent;
  }
}
