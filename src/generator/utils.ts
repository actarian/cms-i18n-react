import { I18N, IOption } from "../types";

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
  sortByName(items);
  return items;
}
