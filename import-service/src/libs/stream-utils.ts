import csvParser from 'csv-parser';
import { Readable } from 'stream';

export const readCsv = async (stream: Readable): Promise<any[]> =>
  new Promise((resolve, reject) => {
    const records = [];
    stream
      .pipe(csvParser())
      .on('data', (data) => records.push(data))
      .on('end', () => {
        resolve(records);
      })
      .on('error', (err) => reject(err));
  });
