import Axios from 'axios'
import fs from 'fs';
import path from 'path';
import logger from './logger';

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