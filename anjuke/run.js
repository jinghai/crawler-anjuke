/**
 * Created by yneos on 2017/1/11.
 */
var My =  require("../lib");
var conf =  require("./conf.js");

var cw = My.createCrawler(conf);
cw.start();