import axios from 'axios';
import XLSX from 'xlsx';

export async function getRemoteXlsl(url: string): Promise<unknown[] | null> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const workbook = XLSX.read(response.data);
    const wsnames = workbook.SheetNames;
    const worksheet = workbook.Sheets[wsnames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);
    // console.log('getRemoteXlsl.row', json[0]);
    return json;
  } catch (error) {
    console.log('getRemoteXlsl.error', error);
    return null;
  }
}
