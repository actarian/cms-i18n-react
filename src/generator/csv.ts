import { csv2jsonAsync } from 'json-2-csv';
import path from 'path';
import { fsRead } from './fs';

export async function getLocalCsv(fileName: string): Promise<unknown[] | null> {
  const pathname = path.join(process.cwd(), 'data', fileName);
  const csv = await fsRead(pathname);
  if (!csv) {
    return null;
  }
  try {
    const json = await csv2jsonAsync(csv, { delimiter: { field: ',' } });
    // console.log('getLocalCsv.row', json[0]);
    return json;
  } catch (error) {
    console.log('getLocalCsv.error', error);
    return null;
  }
}
