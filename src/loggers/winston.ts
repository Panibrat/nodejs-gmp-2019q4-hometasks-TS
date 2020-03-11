import { createLogger, format, transports } from 'winston';
import fs from 'fs';

const filename = './src/loggers/logs/example.log';
const colorizer = format.colorize();

const logger = createLogger(
    {
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(info => {
                const { method, message, query, level, timestamp, body, params } = info;
                let messageToLog = `[${ timestamp }] [${ level.toLocaleUpperCase() }]`;
                if (method) {
                    messageToLog += ` [Method Name: ${ method }]`;
                }
                if (query) {
                    messageToLog += ` [Query: ${ JSON.stringify(query) }]`;
                }
                if (body) {
                    messageToLog += ` [Arguments: ${ JSON.stringify(body) }]`;
                }
                if (params) {
                    messageToLog += ` [Params: ${ JSON.stringify(params) }]`;
                }
                messageToLog += ` [Error Message: ${ message }]`;

                return colorizer.colorize(info.level, messageToLog);
            }),
        ),
        transports: [
            new transports.Console(),
            new transports.Stream({
                                      stream: fs.createWriteStream(filename),
                                  }),
        ],
    },
);

export default logger;
