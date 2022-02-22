const { createLogger, format, transports } = require('winston');
const { DEBUG } = require('./index.js')

const logConfiguration = {
    transports:
        [
            new transports.File({
                level: 'info',

                filename: `${__dirname}/../logs/server.log`,
                format: format.combine(
                    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                    format.align(),
                    format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
                )
            }),
            new transports.Console({
                level: DEBUG ? 'info' : 'error',
                format: format.combine(
                    format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
                    format.align(),
                    format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
                )
            }),
        ],
}

const logger = createLogger(logConfiguration);

module.exports = logger;