import * as countriesList from 'countries-list';
import { isoKeyMapper } from '../utils';

export const continent = {
  id: 'continent',
  name: 'countries-list',
  generator: async (locale: string) => {
    const continent = isoKeyMapper(countriesList.continents);
    return continent;
  }
}
