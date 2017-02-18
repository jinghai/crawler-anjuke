/**
 * Created by yneos on 2017/1/1.
 * 行政区
 */
var conf = {
    cron:"00 00 08 1 3,9 *",//每年3月1日和9月1日
    logLevel: 'verbose',//debug|verbose|info|warn|error
    dbUrl: "mongodb://192.168.2.67/crawler",//'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase'
    crawler: {
        url: "http://www.dianping.com/search/category/1/0/r835",
        interval: 3000
    },

    extractors: [
        {handler: "./e_dzdp_shop.js"},
    ]


}
module.exports = conf;