import { I18N, ILocalizedString, ILocalizedStringKey, IOption } from '../types';

export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function sortByName(items: { name: string }[]): { name: string }[] {
  items.sort((a, b) => {
    return Number(a.name > b.name) - Number(a.name < b.name);
    // return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  return items;
}

export function isoKeyMapper(iso: I18N): IOption[] {
  const items: IOption[] = Object.entries(iso).map(([k, v]) => ({ id: k.toLowerCase(), name: v }));
  // sortByName(items);
  return items;
}

export function isLocalizedString(value: any): value is ILocalizedString {
  let isLocalizedString = false;
  if (value) {
    if (!Array.isArray(value) && typeof value === 'object') {
      const matchKeys = Object.keys(value).reduce((p, c) => p && /^(\w{2})(-\w{2})?$/.test(c), true);
      const matchValues = Object.values(value).reduce((p, c) => p && typeof c === 'string', true);
      // console.log(matchKeys, matchValues);
      isLocalizedString = Boolean(matchKeys && matchValues);
    }
  }
  return isLocalizedString;
}

export function localizedToString(json: ILocalizedString, locale: ILocalizedStringKey = 'en', defaultLocale: ILocalizedStringKey = 'en'): string {
  const localizedString = json[locale] || json[defaultLocale] || Object.values(json)[0];
  return localizedString;
}
