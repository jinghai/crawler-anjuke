/**
 * Created by yneos on 2017/1/10.
 */
var _ = require('lodash');
var Crawler = require("simplecrawler");
var path = require("path");
var cheerio = require('cheerio');

var mongoose = require('mongoose');
var dbInit = false;
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
  createCrawler: function (config) {
    var conf = config.db;
    if (conf.debug) mongoose.set('debug', true);
    mongoose.connect(conf.url);


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
      handler.model = mongoose.model(handler.name, handler.schema);
      handlers.push(handler)
      //console.log(typeof handlers[index].target)
    });

    crawler.addFetchCondition(function (queueItem, stateData) {//发现以后决定是否放入加载队列
      for (var index in handlers) {
        if (handlers[index].target.test(queueItem.url)) {
          return true;
        }
      }
      return false;
    });

    crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
      var $ = null;
      for (var index in handlers) {
        if (handlers[index].target.test(queueItem.url)) {
          if (!$)  $ = cheerio.load(responseBuffer);
          var extractor = handlers[index];
          var data = extractor.handler($, queueItem, responseBuffer, response, crawler);
          console.log(data);
          var entity = new extractor.model(data);
          entity.save();
        }
      }
    });

    crawler.on("queueadd", function (queueItem) {
      //console.log("queueadd",queueItem.url);
    });

    crawler.on("complete", function () {
      mongoose.disconnect();
      console.log("complete");
    });


    return crawler;
  }
}
module.exports = myUtil;

