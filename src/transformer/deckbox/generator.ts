import { SkryfallCard } from '../../../type/skryfall';
import { transform } from 'csv/sync';
import logger from '../../util/logger';
import LanguageReplace from './language-replace.json';
import SetNameReplace from './set-name-replace.json';


/**
 * Consume scryfall data and generate deckbox csv
 */
const generateDeckBoxCsv = (scryfallCards: SkryfallCard[]): string => {

    const columns = ['Count', 'Name', 'Edition', 'Card Number', 'Foil', 'Condition', 'Language'];

    let rows = scryfallCards.map((card: SkryfallCard) => {
        // @ts-ignore
        const setName = SetNameReplace[card.set_name] ? SetNameReplace[card.set_name] : card.set_name;

        return [
            card.count,
            card.name,
            setName,
            card.collector_number,
            card.isCardFoil === true ? 'Foil' : '',
            card.condition,
            // @ts-ignore
            LanguageReplace[card.lang]
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