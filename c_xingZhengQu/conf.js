/**
 * Created by yneos on 2017/1/1.
 * 行政区
 */
var conf = {
    logLevel: 'debug',//debug|info|warn|error
    dbUrl: "mongodb://192.168.2.67/crawler",//'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase'
    crawler: {
        url: "http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/index.html",
        interval: 1 * 1000
    },

    extractors: [
        {handler: "./e_index.js"},
    ]


}
module.exports = conf;