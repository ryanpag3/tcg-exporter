import { SkryfallCard } from '../../type/skryfall';
import { transform } from 'csv/sync';
import logger from '../util/logger';


/**
 * Consume scryfall data and generate deckbox csv
 */
const generateDeckBoxCsv = (scryfallCards: SkryfallCard[]): string => {

    const columns = ['Count', 'Name', 'Edition', 'Card Number', 'Foil', 'Condition', 'Language'];

    let rows = scryfallCards.map((card: SkryfallCard) => {
        return [
            card.count,
            card.name,
            card.set_name,
            card.collector_number,
            card.isCardFoil === true ? 'Foil' : '',
            card.condition,
            card.lang
        ]
    });

    rows = [columns, ...rows];

    const res = transform(rows, function(data) {
        return data.map((d) => `"${d}"`).join(',');
    }).join('\n');

    logger.info(`Generated deckbox csv`);

    return res;
};

export default generateDeckBoxCsv;