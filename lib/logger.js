/**
 * Created by Administrator on 2017/2/6.
 */
var winston = require('winston');


var logger = new winston.Logger({
  level: 'debug',
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'logger.log' })
  ]
});

module.exports = logger;
