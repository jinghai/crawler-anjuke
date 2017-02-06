/**
 * Created by yneos on 2017/1/1.
 */
var conf = {
  //【秒】【分】【小时】【日】【月】【周】 *所有 ?不指定 -区间 */5每5
  cron:"00 00 08 1,10,20 * *",//每月1号,10号,20号早上8:30
  logLevel: 'info',//debug|info|warn|error
  dbUrl: "mongodb://192.168.2.67/crawler",//'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase'
  crawler: {
    url: "http://shanghai.anjuke.com/",
    interval: 10 * 1000
  },

  extractors: [
    {handler: "./area_extract.js"},
    {handler:"./community_extract.js"}
  ]


}
module.exports = conf;