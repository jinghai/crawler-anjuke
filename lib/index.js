/**
 * Created by yneos on 2017/1/10.
 */
var _ = require('lodash');
var Crawler = require("./Crawler.js");
var path = require("path");
var cheerio = require('cheerio');
var crypto = require('crypto');
var mongoose = require('mongoose');
var async = require('async');
var cronJob = require("cron").CronJob;
var config = require(path.resolve("./conf.js"));
//使用环境自己的Promise
mongoose.Promise = global.Promise;


var myUtil = {
  staticResourcesReg: /\.(png|jpg|jpeg|gif|ico|css|js|csv|doc|docx|pdf)+/i,
  defaultCrawlerConfig: {
    maxConcurrency: 1,
    interval: 1000,
    decodeResponses: true,
    respectRobotsTxt: false,
    filterByDomain: true,
    scanSubdomains: true,
    userAgent: 'Mozilla/5.0 (Windows NT 5.2) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30',
    acceptCookies: false
  },
  saveData: function (data, keys, model, cb) {
    var keys = keys;
    var keyString = "";
    _.forEach(keys, function (field, index) {
      keyString += data[field];
    });

    var md5 = crypto.createHash('md5');
    md5.update(keyString);
    var key = md5.digest('hex');//32 characters

    model
      .findOne({__k: key})
      .then(function (doc) {
        if (!doc) {
          data.__k = key;
          var entity = new model(data);
          entity
            .save()
            .then(function (doc) {
              console.log('saved:', doc.url)
              cb(null);
            })
            .catch(function (e) {
              cb(e);
            });
        }
        else {
          console.log('finded')
          cb(null);
        }
      }
    )
      .catch(function (e) {
        cb(e);
      });
  },
  createCrawler: function () {
    var conf = config.db;
    if (conf.debug) mongoose.set('debug', true);


    var crawler = new Crawler(config.crawler.url);
    _.extend(crawler, this.defaultCrawlerConfig, config.crawler);

    var handlers = [];
    _.forEach(config.extractors, function (extrator, index) {
      var schema = extrator.schema;
      var handler = require(path.resolve(extrator.handler));
      handler.schema.__k = String;
      var schema = new mongoose.Schema(handler.schema);
      schema.path('__k').index(true);
      //schema.index({__k:true});

      handler.schema = schema;
      handler.model = mongoose.model(handler.name, schema);
      handler.crawler = crawler;
      handler.mongoose = mongoose;
      handlers.push(handler)
      //console.log(typeof handlers[index].target)
    });

    var stime = null;
    var etime = null;

    crawler.on("crawlstart", function () {
      stime = Date.now();
      mongoose.connect(conf.url);
    });

    //自定义发现规则,可用于不自动发现,仅手动添加队列
    /*crawler.discoverResources = function(buffer, queueItem) {
     /!*$ = cheerio.load(buffer.toString("utf8"));

     return $("a[href]").map(function () {
     return $(this).attr("href");
     }).get();*!/
     };*/

    crawler.addFetchCondition(function (queueItem, stateData) {//发现以后决定是否放入加载队列
      var conditions = [];
      var url = queueItem.url;

      _.forEach(handlers,function(handler){
        if(handler.target){
          conditions.push(handler.target);
        }
        if(handler.helpUrl){
          conditions.push(handler.helpUrl);
        }
      });

      for(var index in conditions){
        if(conditions[index].test(url)){
          return true;
        }
      }

      return false;
    });

    crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
      var next = this.wait();
      var $ = null;
      var tasks = [];
      for (var index in handlers) {
        if (handlers[index].target.test(queueItem.url)) {
          if (!$)  $ = cheerio.load(responseBuffer);
          var extractor = handlers[index];
          tasks.push(function (cb) {
            var data = null;
            try {
              data = extractor.handler($, queueItem, responseBuffer, response);
              if(data){
                myUtil.saveData(data,extractor.keys,extractor.model,cb);
              }
            } catch (e) {
              cb(e);
            }
          });

        }// end if target

      }//end for


      //http://blog.csdn.net/ctbinzi/article/details/39895401
      //并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。
      //如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。其它未执行完的函数的值不会传到最终数据，但要占个位置。
      //并行执行所有满足测试条件的handler，并获得结果集
      async.parallel(tasks, function (err, results) {
        if(err) console.log(err)
      });
    });

    crawler.on("queueadd", function (queueItem) {
      //console.log("queueadd",queueItem.url);
    });

    crawler.on("complete", function () {
      mongoose.disconnect();
      etime = Date.now();
      console.log("complete:", (etime - stime) / 1000 / 60, '分钟');
    });

    crawler.on("stop", function () {
      //mongoose.disconnect();
      console.log("stop");
    });


    return crawler;
  }
}
module.exports = myUtil;

