/**
 * Created by yneos on 2017/1/1.
 * 代理服务器
 */
var conf = {
    //【秒】【分】【小时】【日】【月】【周】 *所有 ?不指定 -区间 */5每5
    cron: "00 00 08 * * *",//每日8:00
    logLevel: 'info',//debug|verbose|info|warn|error
    dbUrl: "mongodb://192.168.2.56/_crawler",//'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase'
    crawler: {
        url: "http://www.xicidaili.com",
        interval: 1 * 1000 * 60 * 16  //间隔16分
    },

    extractors: [
        {handler: "./e_xicidaili.js"},
    ]


}
module.exports = conf;