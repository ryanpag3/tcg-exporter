import fs from 'fs';
import * as csv from 'csv';
import logger from './logger';
import { TCGPlayerRow } from '../../type/csv';

/**
 * Parse a CSV file exported from TCG Player
 */
export const parseTCGPlayerCsv = async (path: string): Promise<TCGPlayerRow[]> => {
    const stream = fs.createReadStream(path);
    const output: TCGPlayerRow[] = [];
    return new Promise((resolve, reject) => {
        stream
        .pipe(csv.parse({ delimiter: ',', columns: true }))
        .on('data', (data: TCGPlayerRow) => output.push(data))
        .on('end', () => {
            logger.info(`retrieved ${output.length} rows from TCGPlayer csv.`);
            resolve(output)
        })
        .on('error', (err) => reject(err));
    });
}