import fs from 'fs';
import path from 'path';
import bluebird from 'bluebird';
import { parseTCGPlayerCsv } from './util/file';
import logger from './util/logger';
import * as skryfall from './util/skryfall';
import { cleanName } from './util/tcgplayer';
import SetReplace from '../set-replace.json';

import { TCGPlayerRow } from '../type/csv';
import axios from 'axios';

async function main() {
    logger.info('downloading updated skryfall database');

    await skryfall.saveBulkData();

    const skryfallData = require('../default-cards.json');

    logger.info('Beginning import of CSV file.');
    const output = await parseTCGPlayerCsv(path.join(__dirname, '../test/TCGplayerCardList.csv'));

    for (const card of output) {
        card.Name = cleanName(card.Name as string); 

        // @ts-ignore
        if (SetReplace[card['Set Code'] as string])
                 // @ts-ignore
                 card['Set Code'] = SetReplace[card['Set Code'] as string];

        const filtered = skryfallData.filter((s: any) => {
            // logger.info(s.name + ' ' + card.Name);
            // logger.info(s.set + ' ' + card['Set Code']?.toLowerCase());
            return s.name === card.Name && s.set === card['Set Code']?.toLowerCase();
        });
        
        logger.info(filtered.length);
    }








    // const executions = [];

    // // logger.info(JSON.stringify(output, null, 4));
    // for (const card of output) {
    //     // if (card.Name !== 'Two-Handed Axe')
    //     //     continue;

    //     card.Name = cleanName(card.Name as string);

    //     // @ts-ignore
    //     if (SetReplace[card['Set Code'] as string])
    //         // @ts-ignore
    //         card['Set Code'] = SetReplace[card['Set Code'] as string];

    //     // @ts-ignore
    //     // executions.push(skryfall.searchCardByName(card.Name, card['Set Code']));
    //     executions.push(card);
    // }

    // const res = await bluebird.map(executions, async (card: TCGPlayerRow) => {
    //     // @ts-ignore
    //     await skryfall.searchCardByName(card.Name, card['Set Code']); 
    // },{
    //     concurrency: 50
    // });
    
}

main();
