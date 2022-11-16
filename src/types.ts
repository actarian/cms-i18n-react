import { availableLocales } from "./config";

export type ILocalizedStringKey = typeof availableLocales[number];
// export type ILocalizedString = { [key: string]: string };
export type ILocalizedString = {
  [Property in ILocalizedStringKey]: string
};

export type I18N = { [key: string]: string };
export type IOption = { id: string; name: string | ILocalizedString };
export type ILocalizedOption = { id: string; name: ILocalizedString, englishName: string };
export type IExtendedOption = IOption & {
  [key: string]: any;
};
export type IExtendedLocalizedOption = ILocalizedOption & {
  [key: string]: any;
};

export type LibraryConfig = { id: string; name: string, localized?: boolean, generator: () => Promise<IExtendedOption[]> };
export type Library = { id: string; name: string, localized?: boolean, items: IExtendedOption[] };
