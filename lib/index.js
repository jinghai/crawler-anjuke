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
var logger = require("./logger.js")(config.logLevel, 'Crawler');
var util = require('./util.js');
//使用环境自己的Promise
mongoose.Promise = global.Promise;
var db = null;
//http://tools.jb51.net/table/useragent
var userAgents = [
    //crhome-win10
    "User-Agent,Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
    //safari 5.1 – MAC
    "User-Agent,Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
    "User-Agent,Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
    "User-Agent,Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0;",
    "User-Agent, Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv,2.0.1) Gecko/20100101 Firefox/4.0.1",
    "User-Agent,Mozilla/5.0 (Windows NT 6.1; rv,2.0.1) Gecko/20100101 Firefox/4.0.1",
    "User-Agent,Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11",
    "User-Agent,Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11",
    "User-Agent, Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
    "User-Agent, Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Maxthon 2.0)",
    "User-Agent, Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; TencentTraveler 4.0)",
];
var proxys = [
    {host: '218.14.121.230', port: 8080},
    {host: 'proxy.dc.lan', port: 1234},
    {host: '120.25.194.203', port: 8888},
    {host: '222.82.16.200', port: 3128},
];
var fetchTimes = 0;

var myCrawler = {
    staticResourcesReg: /\.(png|jpg|jpeg|gif|ico|css|js|csv|doc|docx|pdf)+/i,
    defaultCrawlerConfig: {
        maxConcurrency: 1,
        interval: 10000,
        decodeResponses: true,
        respectRobotsTxt: false,
        filterByDomain: true,
        scanSubdomains: true,
        userAgent: 'Mozilla/5.0 (Windows NT 5.2) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30',
        acceptCookies: false,
        maxDepth: 0
    },
    saveData: function (queueItem, data, keys, model, cb) {
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
                            logger.info(fetchTimes, 'save', queueItem.url, 'ok');
                            cb(null);
                        })
                        .catch(function (e) {
                            logger.error(fetchTimes, 'save', queueItem.url, "save error");
                            cb(null);//或略错误
                        });
                }
                else {
                    logger.info(fetchTimes, 'save', queueItem.url, 'no');
                    cb(null);
                }
            }
        )
            .catch(function (e) {
                logger.error(fetchTimes, 'save', queueItem.url, "find error");
                cb(null);
            });
    },
    createCrawler: function () {
        //if(config.logLevel==='debug') mongoose.set('debug', true);
        db = mongoose.createConnection(config.dbUrl);

        var crawler = new Crawler(config.crawler.url);
        _.extend(crawler, this.defaultCrawlerConfig, config.crawler);
        var jobid = null;

        var handlers = [];
        _.forEach(config.extractors, function (extrator, index) {
            var schema = extrator.schema;
            var handler = require(path.resolve(extrator.handler));
            handler.schema.__k = String;
            var schema = new mongoose.Schema(handler.schema);
            schema.path('__k').index(true);
            //schema.index({__k:true});

            handler.schema = schema;
            handler.model = db.model(handler.name, schema);
            handler.crawler = crawler;
            handler.mongoose = db;
            handlers.push(handler)
            //logger.log(typeof handlers[index].target)
        });

        var stime = null;
        var etime = null;


        //自定义发现规则,可用于不自动发现,仅手动添加队列
        /*crawler.discoverResources = function (buffer, queueItem) {
         logger.debug("discoverResources");
         /!*$ = cheerio.load(buffer.toString("utf8"));

         return $("a[href]").map(function () {
         return $(this).attr("href");
         }).get();*!/
         };*/

        crawler.addFetchCondition(function (queueItem, stateData) {//发现以后决定是否放入加载队列
            var conditions = [];
            var url = queueItem.url;

            _.forEach(handlers, function (handler) {
                if (handler.target) {
                    conditions.push(handler.target);
                }
                if (handler.helpUrl) {
                    conditions.push(handler.helpUrl);
                }
            });

            for (var index in conditions) {
                if (conditions[index].test(url)) {
                    //queueItem.url += "?from=Filter_1&hfilter=filterlist";
                    return true;
                }
            }


            return false;
        });

        crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
            //userAgents临时方案
            fetchTimes++;
            crawler.userAgent = userAgents[fetchTimes % userAgents.length];

            /*if((fetchTimes % 2) == 0){
             crawler.stop();
             }*/

            //crawler.useProxy = true;
            //crawler.proxyHostname = proxys[fetchTimes % proxys.length].host;
            // crawler.proxyPort = proxys[fetchTimes % proxys.length].port;

            logger.debug(fetchTimes, 'fetched', queueItem.url)

            var next = this.wait();
            var $ = cheerio.load(responseBuffer);
            var tasks = [];
            for (var index in handlers) {
                if (handlers[index].target.test(queueItem.url)) {
                    var extractor = handlers[index];
                    tasks.push(function (cb) {
                        var data = null;
                        try {
                            data = extractor.handler($, queueItem, responseBuffer, response);
                            if (data && _.isArray(data)) {//保存多条数据
                                var saveTasks = [];
                                _.forEach(data, function (da) {
                                    saveTasks.push(function (bb) {
                                        myCrawler.saveData(queueItem, da, extractor.keys, extractor.model, bb);
                                    });
                                });
                                if (saveTasks.length > 0) {
                                    async.parallel(saveTasks, function (err, results) {
                                        if (err) logger.error(err);
                                        cb(null);
                                    });
                                } else {
                                    cb(null)
                                }

                            } else {
                                myCrawler.saveData(queueItem, data, extractor.keys, extractor.model, cb);
                            }
                        } catch (e) {
                            logger.error(e);
                            cb(null);
                        }
                    });

                }// end if target

            }//end for


            //http://blog.csdn.net/ctbinzi/article/details/39895401
            //并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。
            //如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。其它未执行完的函数的值不会传到最终数据，但要占个位置。
            //并行执行所有满足测试条件的handler，并获得结果集
            //logger.log(fetchTimes,queueItem.url);
            if (tasks.length > 0) {
                async.parallel(tasks, function (err, results) {
                    next();
                    if (err) logger.error(err)
                });
            } else {
                next();
            }

        });

        crawler.on("queueadd", function (queueItem) {
            //logger.log("queueadd",queueItem.url);
        });


        crawler.on("crawlstart", function () {
            stime = Date.now();
            logger.info("start");
            //mongoose.connect(conf.url);

        });


        crawler.on("complete", function () {
            ogger.info("complete");
            fetchTimes = 0;
            //db.close();
            etime = Date.now();
            logger.info("用时",util.dateDiff(etime-stime));

        });

        crawler.on("stop", function () {
            logger.info("stop");
            fetchTimes = 0;
            //db.close();
        });

        if (config.cron) {
            jobid = new cronJob(config.cron, function () {
                if (!crawler.running) {
                    logger.info('定时启动爬虫');
                    crawler.start();
                }
            });
            logger.info("启动定时任务");
            jobid.start();
        }


        return crawler;
    }
}
module.exports = myCrawler;

