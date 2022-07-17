import log4js from 'log4js';

log4js.addLayout('json', (config) => {
    return (event) => {
        return JSON.stringify(event) + config.separator;
    }
});

// log4js.configure({
//     appenders: {
//         out: {
//             type: 'stdout',
//             layout: {
//                 type: process.env.NODE_ENV === 'production' ? 'json' : 'colored',
//                 separator: ','
//             }
//         }
//     },
//     categories: {
//         default: {
//             appenders: ['out'],
//             level: process.env.LOG_LEVEL || 'INFO'
//         }
//     }
// })

const logger = log4js.getLogger();

logger.level = process.env.LOG_LEVEL || 'INFO';

export default logger;