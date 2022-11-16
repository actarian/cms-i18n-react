import path from 'path';
import { fsWriteJson } from './fs';
import { getLibraries } from './libraries';

async function Build(pathname: string): Promise<any> {
  const tasks: Promise<void>[] = [];
  const libraries = await getLibraries();
  for (const library of libraries) {
    const filePath = path.join(process.cwd(), pathname, `${library.id}.json`);
    const task = fsWriteJson(filePath, library);
    tasks.push(task);
  }
  return await Promise.allSettled(tasks);
}

function BuildCollections(pathname: string) {
  if (process.argv.includes('generate') && process.env.NODE_ENV !== 'production') {
    global.Request = {} as any;
    Build(pathname).catch(error => {
      console.error(error);
    });
  }
}

BuildCollections('public/api');
