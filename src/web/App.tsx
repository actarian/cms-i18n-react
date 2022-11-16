import { useState } from 'react';
import { IExtendedOption, Library } from '../types';
import { Code } from './Code';
import './styles.scss';

import language from '../data/language.json';
// import nationality from '../data/nationality.json';
import continent from '../data/continent.json';
import country from '../data/country.json';
import municipality from '../data/municipality.json';
import province from '../data/province.json';
import region from '../data/region.json';
import { localizedToString, sortByName } from '../generator/utils';

const libraries = [
  language,
  // nationality,
  continent,
  country,
  region,
  province,
  municipality,
];

const localize = (value: any) => {
  if (typeof value === 'string') {
    return value;
  } else {
    return localizedToString(value, 'it');
  }
}

function localizeItems(items: IExtendedOption[]) {
  items.forEach(item => {
    item.name = localize(item.name);
  });
  sortByName(items as { name: string }[]);
  return items;
}

export default function App() {

  const [library, setLibrary] = useState<Library>(libraries[0]);

  console.log('library', library.id, library.items);

  const localizedItesm = localizeItems(library.items);

  return (
    <div className="app">
      <h1>CMS i18n</h1>
      <div className="wrapper">
        <aside>
          <div className="libraries">
            {libraries.map(library => (
              <button key={library.id} type="button" className="libraries__item" onClick={() => setLibrary(library)}>
                <span className="title">{library.id}</span>
                <span className="subtitle">{library.name}</span>
              </button>
            ))}
          </div>
        </aside>
        <main>
          {library && (
            <div className="libraries__item">
              <div className="head">
                <div className="title">{library.id}</div>
                <div className="title">{localizedItesm.length}</div>
              </div>
              <div className="content">
                <Code value={localizedItesm[0]} />
                <ul className="list">
                  {localizedItesm.filter((x, i) => i < 200).map((item) => (
                    <li key={library.name + '-' + item.id} className="list__item">
                      <span className="key">{item.id}</span>
                      <span className="value">{item.name as string}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
