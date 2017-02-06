/**
 * Created by Administrator on 2017/2/6.
 */
//https://github.com/winstonjs/winston#using-the-default-logger
var winston = require('winston');
var util = require('./util.js');
//https://github.com/winstonjs/winston/blob/master/docs/transports.md#mongodb-transport
//var MongoDB = require('winston-mongodb').MongoDB;


module.exports = function (logLevel, perfix) {
    perfix = perfix ? ' ' + perfix + ': ' : '';
    function formatter(options) {
        return util.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S') + perfix + options.level.toUpperCase() + ' ' + (options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
    }

    var logger = new winston.Logger({
        level: logLevel,
        exitOnError: false,
        transports: [
            new (winston.transports.Console)({
                formatter: formatter
            }),
            new (winston.transports.File)({
                filename: 'logger.log',
                handleExceptions: true,
                json: false,
                formatter: formatter,
                maxsize: 1024 * 1024 * 200,//200M
                maxFiles: 1
            })
        ]
    });

    return logger;
};
