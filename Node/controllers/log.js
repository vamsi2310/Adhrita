const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const winston = require('winston');





var log = winston.createLogger({
        format: combine(
                timestamp(),
                prettyPrint()
        ),
        transports: [
                new (winston.transports.Console),
                new winston.transports.File({ filename: 'Log/node.log'})
        ]
});




module.exports = log;
