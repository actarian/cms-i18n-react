export type I18N = { [key: string]: string };
export type IOption = { id: string; name: string };
export type IExtendedOption = IOption & {
  [key: string]: any;
};

export type LibraryConfig = { id: string; name: string, localized?: boolean, generator: (locale: string) => Promise<IExtendedOption[]> };
export type Library = { id: string; name: string, localized?: boolean, items: IExtendedOption[] };
