/**
 * Created by yneos on 2017/1/1.
 * 点评
 */
var conf = {
    //【秒】【分】【小时】【日】【月】【周】 *所有 ?不指定 -区间 */5每5
    //cron:"00 00 08 1 3,9 *",//每年3月1日和9月1日
    logLevel: 'verbose',//debug|verbose|info|warn|error
    //dbUrl: "mongodb://192.168.2.67/crawler",//'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase'
    dbUrl: "mongodb://192.168.2.56/crawler",
    crawler: {
        //url: "http://www.dianping.com/shopall/1/0",//test type
        //url:'http://www.dianping.com/search/category/1/10/g24645r1022',//test shop /1/10/g132 g24645
        //url:'http://www.dianping.com/search/category/1/10/g24645r875',//test shop

        //url:'http://www.dianping.com/citylist/citylist?citypage=1',全国
        //url:'http://www.dianping.com/search/category/1/0',//上海
        url: 'http://www.dianping.com/search/category/1/25/g136',//上海电影院
        interval: 1000,
        maxConcurrency: 1,
    },

    extractors: [
        //{handler: "./e_dzdp_type.js"},
        //{handler: "./e_dzdp_shangqu.js"},
        //{handler: "./e_dzdp_dibiao.js"},
        //{handler: "./e_dzdp_ditie.js"},
        {handler: "./e_dzdp_shop.js"},
    ]


}
module.exports = conf;