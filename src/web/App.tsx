import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { availableLocales } from '../config';
import { localizedToString, sortByName } from '../generator/utils';
import { IExtendedOption, ILocalizedStringKey, Library } from '../types';
import { Code } from './Code';
import './styles.scss';

const libraryNames = [
  'language',
  // 'nationality',
  'continent',
  'country',
  'region',
  'province',
  'municipality',
];

const localize = (value: any, locale: ILocalizedStringKey = 'en') => {
  if (typeof value === 'string') {
    return value;
  } else {
    return localizedToString(value, locale);
  }
}

function localizeItems(items: IExtendedOption[], locale: ILocalizedStringKey = 'en') {
  const localizedItems: IExtendedOption[] = items.map(item => ({
    ...item,
    name: localize(item.name, locale),
  }));
  sortByName(localizedItems as { name: string }[]);
  return localizedItems;
}

export default function App() {

  const [locale, setLocale] = useState<ILocalizedStringKey>('en');

  const [libraries, setLibraries] = useState<Library[]>([]);

  const [library, setLibrary] = useState<Library | null>(null);

  const [items, setItems] = useState<IExtendedOption[]>([]);

  useEffect(() => {
    const getLibraries = async () => {
      const promises = libraryNames.map(x => axios.get(`api/${x}.json`));
      const responses = await Promise.allSettled(promises);
      const libraries = responses.filter(x => x.status === 'fulfilled').map(x => (x as any as PromiseFulfilledResult<AxiosResponse<Library>>).value.data);
      const library = libraries[0];
      setLibraries(libraries);
      onSelect(library);
    };
    getLibraries();
  }, []);

  const onChangeLocale = (locale: ILocalizedStringKey) => {
    setLocale(locale);
    if (library) {
      onSelect(library, locale);
    }
  }

  const onSelect = (library: Library, currentLocale: ILocalizedStringKey = locale) => {
    const items = localizeItems(library.items, currentLocale);
    setLibrary(library);
    setItems(items);
    console.log('onSelect', library.id, currentLocale, items, library.items);
  }

  return (
    <div className="app">
      <div className="head">
        <h1>CMS i18n</h1>
        <ul className="locales">
          {availableLocales.map(l => (
            <li className={'locales__item' + (l === locale ? ' active' : '')} onClick={() => onChangeLocale(l)}>{l}</li>
          ))}
        </ul>
      </div>
      <div className="wrapper">
        <aside>
          <div className="libraries">
            {libraries.map(library => (
              <button key={library.id} type="button" className="libraries__item" onClick={() => onSelect(library)}>
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
                <div className="title">
                  <a href={`/cms-i18n-react/api/${library.id}.json`} target="_blank">
                    {library.id}.json
                  </a>
                </div>
                <div className="title">{items.length}</div>
              </div>
              <div className="content">
                <Code value={items[0]} />
                <ul className="list">
                  {items.filter((x, i) => i < 200).map((item) => (
                    <li key={library.name + '-' + item.id + '-' + locale} className="list__item">
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
