/**
 * Created by yneos on 2017/1/1.
 */
var conf = {
  //【秒】【分】【小时】【日】【月】【周】 *所有 ?不指定 -区间 */5每5
  cron:"00 00 08 1,10,20 * *",//每月1号,10号,20号早上8:30
  crawler: {
    url: "http://shanghai.anjuke.com/",
    maxConcurrency: 2,
    interval: 6000
  },

  db: {
    //'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase'
    url: "mongodb://192.168.2.67/test",
    debug: false
  },

  extractors: [
    {handler: "./area_extract.js"},
    {handler:"./community_extract.js"}
  ]


}
module.exports = conf;