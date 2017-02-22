/**
 * Created by yneos on 2017/1/1.
 * 行政区
 */
var conf = {
    cron:"00 00 08 1 3,9 *",//每年3月1日和9月1日
    logLevel: 'info',//debug|verbose|info|warn|error
    dbUrl: "mongodb://192.168.2.67/crawler",//'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase'
    crawler: {
        url: "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/",
        interval: 1000
    },

    extractors: [
        {handler: "./e_index.js"},
    ]


}
module.exports = conf;