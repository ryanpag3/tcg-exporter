import path from 'path';
import fs from 'fs';
import generateDeckBoxCsv from './transformer/deckbox/generator';
import { parseTCGPlayerCsv } from './util/file';
import logger from './util/logger';
import * as skryfall from './util/skryfall';

async function main() {
    // await skryfall.saveBulkData();
    logger.info('Downloaded updated skryfall database.');

    const output = await parseTCGPlayerCsv(path.join(__dirname, '../test/TCGplayerCardList.csv'));
    logger.info('Retrieved TCGPlayer csv from file.');

    const skryfallData = skryfall.convertToSkryfall(output);
    logger.info('Converted data to skryfall format.');

    const deckbox = generateDeckBoxCsv(skryfallData);
    
    fs.writeFileSync(path.join(__dirname, '../generated/deckbox.csv'), deckbox);
}

main();
