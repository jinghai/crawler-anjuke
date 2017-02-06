/**
 * Created by yneos on 2017/1/11.
 */
var MyCrawler =  require("../lib");
var conf =  require("./conf.js");

var cw = MyCrawler.createCrawler(conf);
cw.start();
