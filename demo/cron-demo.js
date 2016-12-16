/**
 * Created by Administrator on 2016/12/16.
 */

var cronJob = require("cron").CronJob;
var jobid = new cronJob('*/5 * * * * *', function () {
  console.log(new Date(),'执行定时任务');
  this.stop();
}, function(){
  console.log(new Date(),'定时任务完成');
}, false, 'Asia/Chongqing');
jobid.start();