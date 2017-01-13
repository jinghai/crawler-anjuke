/**
 * Created by yneos on 2017/1/1.
 */
var conf = {
  crawler: {
    url: "http://shanghai.anjuke.com/",
    //url:"http://shanghai.anjuke.com/market/pudong/",
    //url:"http://shanghai.anjuke.com/market/lingangxincheng/"

    maxConcurrency: 1,
    interval: 1000,
    acceptCookies: false,
    maxDepth: 0
  },

  db: {
    //'mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase'
    url: "mongodb://192.168.2.67/test",
    debug: false
  },

  extractors: [{
    handler: "./area_extract.js"
  }]


}
module.exports = conf;