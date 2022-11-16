import { useState } from 'react';
import { Library } from '../types';
import { Code } from './Code';
import './styles.scss';

import language from '../../dist/language/it.json';
// import nationality from '../dist/nationality/it.json';
import country from '../../dist/country/it.json';
import municipality from '../../dist/municipality.json';
import province from '../../dist/province.json';
import region from '../../dist/region.json';

const libraries = [
  language,
  // nationality,
  country,
  region,
  province,
  municipality,
];

export default function App() {

  const [library, setLibrary] = useState<Library>(libraries[0]);

  console.log('library', library.id, library.items);

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
                <div className="title">{library.items.length}</div>
              </div>
              <div className="content">
                <Code value={library.items[0]} />
                <ul className="list">
                  {library.items.filter((x, i) => i < 200).map((item) => (
                    <li key={library.name + '-' + item.id} className="list__item">
                      <span className="key">{item.id}</span>
                      <span className="value">{item.name}</span>
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
