/**
 * Created by yneos on 2017/1/11.
 */
var MyCrawler =  require("../lib");
var cronJob = require("cron").CronJob;
var conf =  require("./conf.js");

var cw = MyCrawler.createCrawler(conf);
cw.start();



var jobid = new cronJob(conf.cron, function () {
  console.log(new Date(),'触发定时任务');
  if(!cw.running){
    cw.start();
  }
});
//jobid.start();