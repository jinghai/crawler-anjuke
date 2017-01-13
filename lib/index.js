/**
 * Created by yneos on 2017/1/10.
 */
var _ = require('lodash');
var Crawler = require("simplecrawler");
var path = require("path");
var cheerio = require('cheerio');
var crypto = require('crypto');
var mongoose = require('mongoose');
var async = require('async');
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
  saveDatas:function(map,next){

  },
  createCrawler: function (config) {
    var conf = config.db;
    if (conf.debug) mongoose.set('debug', true);


    var crawler = Crawler(config.crawler.url);
    _.extend(crawler, this.defaultCrawlerConfig, config.crawler);

    //路径测试
    /* console.log(path.resolve("."))
     console.log(__dirname);
     console.log(__filename);
     console.log(process.cwd());
     console.log(path.resolve('./'));*/

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
      for (var index in handlers) {
        if (handlers[index].target.test(queueItem.url)) {
          return true;
        }
      }
      return false;
    });

    crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
      var next = this.wait();
      var $ = null;
      for (var index in handlers) {
        if (handlers[index].target.test(queueItem.url)) {
          if (!$)  $ = cheerio.load(responseBuffer);
          var extractor = handlers[index];
          var data = extractor.handler($, queueItem, responseBuffer, response);
          if (data) {
            var keys = extractor.keys;
            var keyString = "";
            _.forEach(keys,function(field,index){
              keyString += data[field];
            });

            var md5 = crypto.createHash('md5');
            md5.update(keyString);
            var key = md5.digest('hex');//32 characters

            extractor.model.findOne({__k:key}).then(function(doc){
              if(!doc){
                data.__k = key;
                var entity = new extractor.model(data);
                entity.save().then(function(doc){
                  console.log('saved:',doc.url)
                  next();
                });
              }else{
                next();
              }
            })
          }else{//无数据，handler接管
            next();
          }

        }else{
          console.log('not target:',queueItem.url);
          next();
        }

        //http://blog.csdn.net/ctbinzi/article/details/39895401
        //并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。
        //如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。其它未执行完的函数的值不会传到最终数据，但要占个位置。
        //并行执行所有满足测试条件的handler，并获得结果集
        /*async.parallel([
          function(cb) { t.fire('a400', cb, 400) },
          function(cb) { t.fire('a200', cb, 200) },
          function(cb) { t.fire('a300', cb, 300) }
        ], function (err, results) {
          log(’1.1 err: ‘, err); // -> undefined
          log(’1.1 results: ‘, results); // ->[ 'a400', 'a200', 'a300' ]
        });

        async.parallel([
          function(cb) { log('1.2.1: ', 'start'); t.fire('a400', cb, 400) }, // 该函数的值不会传给最终callback，但要占个位置
          function(cb) { log('1.2.2: ', 'start'); t.err('e200', cb, 200) },
          function(cb) { log('1.2.3: ', 'start'); t.fire('a100', cb, 100) }
        ], function(err, results) {
          log(’1.2 err: ‘, err); // -> e200
          log(’1.2 results: ‘, results); // -> [ , undefined, 'a100' ]
        });

        async.parallel({
          a: function(cb) { t.fire(‘a400′, cb, 400) },
          b: function(cb) { t.fire(‘c300′, cb, 300) }
        }, function(err, results) {
          log(’1.3 err: ‘, err); // -> undefined
          log(’1.3 results: ‘, results); // -> { b: ‘c300′, a: ‘a400′ }
        });*/


      }
    });

    crawler.on("queueadd", function (queueItem) {
      //console.log("queueadd",queueItem.url);
    });

    crawler.on("complete", function () {
      mongoose.disconnect();
      etime=Date.now();
      console.log("complete:",(etime-stime)/1000/60,'分钟');
    });


    return crawler;
  }
}
module.exports = myUtil;

