import path from 'path';
import { availableLocales } from '../config';
import { fsWriteJson } from './fs';
import { getLibrariesFromLocale } from './libraries';

async function buildCollections(pathname: string, locales: string[]): Promise<any> {
  const tasks: Promise<void>[] = [];
  for (const locale of locales) {
    const first = locales.indexOf(locale) === 0;
    const libraries = await getLibrariesFromLocale(locale, first);
    for (const library of libraries) {
      if (library.localized) {
        const filePath = path.join(process.cwd(), pathname, library.id, `${locale}.json`);
        const task = fsWriteJson(filePath, library);
        tasks.push(task);
      } else if (first) {
        const filePath = path.join(process.cwd(), pathname, `${library.id}.json`);
        const task = fsWriteJson(filePath, library);
        tasks.push(task);
      }
    }
  }
  return await Promise.allSettled(tasks);
}

async function Build(pathname: string, locales: string[]) {
  await buildCollections(pathname, locales);
}

function BuildCollections(pathname: string, locales: string[]) {
  if (process.argv.includes('generate') && process.env.NODE_ENV !== 'production') {
    global.Request = {} as any;
    Build(pathname, locales).catch(error => {
      console.error(error);
    });
  }
}

BuildCollections('dist', availableLocales);
