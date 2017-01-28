/**
 * Created by yneos on 2017/1/1.
 */
var conf = {
  //【秒】【分】【小时】【日】【月】【周】 *所有 ?不指定 -区间 */5每5
  cron:"0 30 0 1 * ?",//每月1号0:30
  crawler: {
    url: "http://shanghai.anjuke.com/",
    //url:"http://shanghai.anjuke.com/market/pudong/",
    //url:"http://shanghai.anjuke.com/market/lingangxincheng/"

    maxConcurrency: 1,
    interval: 3000,
    acceptCookies: false,
    maxDepth: 0
  },

  db: {
    //'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase'
    url: "mongodb://192.168.2.67/test",
    debug: false
  },

  extractors: [
    //{handler: "./area_extract.js"},
    {handler:"./community_extract.js"}
  ]


}
module.exports = conf;