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
  'subContinent',
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
          {false && availableLocales.map(l => (
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
                  {library.localized && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.961 7.5h1.303l2.47 6.5h-1.349l-.538-1.5h-2.438l-.535 1.5h-1.392l2.479-6.5zm1.517 3.965l-.857-2.451-.851 2.451h1.708zm8.092-1.402c.062-.243.1-.426.135-.605l-1.1-.214-.109.5c-.371-.054-.767-.061-1.166-.021.009-.268.025-.531.049-.784h1.229v-1.042h-1.081c.054-.265.099-.424.144-.575l-1.074-.322c-.079.263-.145.521-.211.897h-1.226v1.042h1.092c-.028.337-.046.686-.051 1.038-1.207.443-1.719 1.288-1.719 2.054 0 .904.714 1.7 1.842 1.598 1.401-.128 2.337-1.186 2.885-2.487.567.327.805.876.591 1.385-.197.471-.78.919-1.892.896v1.121c1.234.019 2.448-.45 2.925-1.583.465-1.108-.066-2.318-1.263-2.898zm-1.446.766c-.175.387-.404.771-.697 1.075-.045-.323-.076-.676-.093-1.054.268-.035.537-.041.79-.021zm-1.894.362c.03.473.084.909.158 1.298-.997.183-1.037-.801-.158-1.298zm-2.23-8.191c5.514 0 10 3.592 10 8.007 0 4.917-5.145 7.961-9.91 7.961-1.937 0-3.384-.397-4.394-.644-1 .613-1.594 1.037-4.272 1.82.535-1.373.722-2.748.601-4.265-.837-1-2.025-2.4-2.025-4.872 0-4.415 4.486-8.007 10-8.007zm0-2c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 1.417.345 2.774.503 4.059.503 7.083 0 11.91-4.837 11.91-9.961-.001-5.811-5.702-10.006-12.001-10.006z" /></svg>
                  )}
                  <a href={`/cms-i18n-react/api/${library.id}.json`} target="_blank">
                    {library.id}.json
                  </a>
                  {library.localized && (
                    <ul className="locales">
                      {availableLocales.map(l => (
                        <li className={'locales__item' + (l === locale ? ' active' : '')} onClick={() => onChangeLocale(l)}>{l}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="title">{items.length}</div>
              </div>
              <div className="content">
                <ul className="list">
                  {items.filter((x, i) => i < 200).map((item) => (
                    <li key={library.name + '-' + item.id + '-' + locale} className="list__item">
                      <span className="key">
                        {item.id}
                      </span>
                      <span className="value">{item.name as string}</span>
                    </li>
                  ))}
                </ul>
                <Code value={items[0]} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
