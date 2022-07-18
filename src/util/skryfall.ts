import Axios from 'axios'
import fs from 'fs';
import path from 'path';
import { TCGPlayerRow } from '../../type/csv';
import logger from './logger';
import { cleanName } from './tcgplayer';
import SetReplace from '../../set-replace.json';

const axios = Axios.create({
    baseURL: 'https://api.scryfall.com'
});

export const getCardByCode = async (setCode: string, cardNumber: number) => {
    const res = await axios.get(`/cards/${setCode.toLowerCase()}/${cardNumber}`);
    logger.info(res.data);
}

export const searchCardByName = async (name: string, set: string) => {
    const res = await axios.get('/cards/named', {
        params: {
            fuzzy: name
        }
    });

    logger.info(res.data);
}

export const saveBulkData = async () => {
    const bulkDataInfo = await axios.get('/bulk-data');

    const defaultCardsInfo = bulkDataInfo.data.data.filter((d: any) => d.type === 'default_cards')[0];

    const defaultCards = await axios.get(defaultCardsInfo.download_uri);

    logger.info(defaultCards.data);

    fs.writeFileSync(
        path.join(__dirname, '../../default-cards.json'), 
        JSON.stringify(defaultCards.data, null, 4));
}

/**
 * Convert all cards to skryfall format
 */
export const convertToSkryfall = async (cards: TCGPlayerRow[]) => {
    const skryfallData = require('../../default-cards.json');

    const toReturn: any = [];

    for (const card of cards) {
        card.Name = cleanName(card.Name as string); 

        card['Set Code'] = card['Set Code']?.toLowerCase();

        if (card['Card Number']?.endsWith('p'))
            card['Card Number'] = card['Card Number'].substring(0, card['Card Number'].length - 1);

        // promo-pack edge case
        if (card['Set Code']?.startsWith('pp') && card['Set Code'].length > 3) {
            card['Set Code'] = card['Set Code'].slice(2);
        }

        // @ts-ignore
        if (SetReplace[card['Set Code']?.toLowerCase()]) {
            // @ts-ignore
            card['Set Code'] = SetReplace[card['Set Code']];
        }

        const filtered = skryfallData.filter((s: any) => {

            const checkForFoil = s.foil === (card.Printing === 'Foil')
                || s.nonfoil === (card.Printing === 'Normal');

            return s.collector_number === card['Card Number'] 
                    && s.set === card['Set Code']?.toLowerCase()
                    && checkForFoil;
        });

        const filteredFromProductId = skryfallData.filter((s: any) => {
            return s.tcgplayer_id === Number.parseInt(card['Product ID'] as string);
        });
        
        if (filtered.length !== 1 && filteredFromProductId !== 1)
            throw new Error(`Could not find skryfall information for card: ` + JSON.stringify(card, null, 4));
        
        toReturn.push(filteredFromProductId[0] || filtered[0]);
    }

    return toReturn;
}