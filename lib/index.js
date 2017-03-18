/**
 * Created by yneos on 2017/1/10.
 */
var _ = require('lodash');
var Crawler = require("./Crawler.js");
var path = require("path");
var fs = require('fs');
var cheerio = require('cheerio');
var crypto = require('crypto');
var mongoose = require('mongoose');
var async = require('async');
var cronJob = require("cron").CronJob;
var baseDir = path.resolve(".");
var config = require(path.join(baseDir, "./conf.js"));
var logger = require("./logger.js")(config.logLevel, 'Crawler');
var util = require('./util.js');
var queueFile = path.join(baseDir, "./queue.js");
//使用环境自己的Promise
mongoose.Promise = global.Promise;
var db = null;
//http://tools.jb51.net/table/useragent
var userAgents = [
    //crhome-win10
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
    //safari 5.1 – MAC
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
    "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0;",
    " Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv,2.0.1) Gecko/20100101 Firefox/4.0.1",
    "Mozilla/5.0 (Windows NT 6.1; rv,2.0.1) Gecko/20100101 Firefox/4.0.1",
    "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11",
    "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11",
    " Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
    " Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Maxthon 2.0)",
    " Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; TencentTraveler 4.0)",
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
        filterByDomain: false,
        scanSubdomains: true,
        userAgent: 'Mozilla/5.0 (Windows NT 5.2) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30',
        acceptCookies: false,
        maxDepth: 0,
        customHeaders: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Connection': 'close'
        }
    },
    saveData: function (queueItem, data, keys, model, allowUpdate, mergeFields, cb) {
        var keys = keys;
        var keyString = "";
        if (!data) {
            cb(null);
            return;
        } else {
            data.__url = queueItem.url;
        }

        if (keys && _.isArray(keys) && keys.length > 0) {
            _.forEach(keys, function (field, index) {
                keyString += data[field];
            });
        } else {
            keyString = queueItem.url;
        }


        var md5 = crypto.createHash('md5');
        md5.update(keyString);
        var key = md5.digest('hex');//32 characters
        var st = Date.now();
        model
            .findOne({__k: key})
            .then(function (doc) {
                if (!doc) {
                    data.__k = key;
                    data.__created = new Date();
                    util.removeEmpty(data);
                    var entity = new model(data);
                    entity
                        .save()
                        .then(function (doc) {
                            var et = Date.now();
                            logger.info(fetchTimes, queueItem.url, 'save ok:', et - st);
                            cb(null);
                        })
                        .catch(function (e) {
                            logger.error(fetchTimes, queueItem.url, "save error:", e.message);
                            cb(null);//或略错误
                        });
                }
                else {
                    if (allowUpdate) {
                        if (mergeFields && _.isArray(mergeFields)) {
                            _.forEach(mergeFields, function (f) {
                                //对String和Array字段进行合并
                                data[f] = util.mergeField(doc[f], data[f]);
                            });
                        }
                        util.copyIfExist(doc, data);
                        util.removeEmpty(doc);
                        //_.extend(doc, data);
                        doc.__updated = new Date();
                        doc.__v = ++doc.__v;
                        //var entity = new model(doc);
                        model
                            .findByIdAndUpdate({'_id': doc._id}, {$set: doc})
                            .then(function (doc) {
                                var et = Date.now();
                                logger.info(fetchTimes, queueItem.url, 'update ok', et - st);
                                cb(null);
                            })
                            .catch(function (e) {
                                logger.error(fetchTimes, queueItem.url, "update error", e.message);
                                cb(null);//或略错误
                            });
                    } else {
                        logger.info(fetchTimes, queueItem.url, 'no update');
                        cb(null);
                    }


                }
            }
        )
            .catch(function (e) {
                logger.error(fetchTimes, queueItem.url, "find error:", e.message);
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
            var handler = require(path.join(baseDir, extrator.handler));
            handler.schema.__k = String;
            handler.schema.__created = Date;
            handler.schema.__url = String;
            handler.schema.__updated = Date;
            var schema = new mongoose.Schema(handler.schema);
            schema.path('__k').index(true);
            //schema.index({__k:true});

            //handler.schema = schema;
            handler.model = db.model(handler.name, schema);
            handler.crawler = crawler;
            handler.mongoose = db;
            handlers.push(handler)
        });

        var stime = null;
        var etime = null;


        //自定义发现规则,可用于不自动发现,仅手动添加队列
        /*crawler.discoverResources = function (buffer, queueItem) {
         logger.debug(fetchTimes,"discoverResources");
         /!*$ = cheerio.load(buffer.toString("utf8"));

         return $("a[href]").map(function () {
         return $(this).attr("href");
         }).get();*!/
         };*/

        var fetchConditions = [];
        _.forEach(handlers, function (handler) {
            if (handler.target) {
                var tar = handler.target;
                if (_.isArray(tar)) {
                    _.forEach(tar, function (target) {
                        if (target.test) {
                            fetchConditions.push(target);
                        }
                    })
                } else {
                    if (handler.target.test) {
                        fetchConditions.push(handler.target);
                    }
                }
            }

            if (handler.helpUrl) {
                var tar = handler.helpUrl;
                if (_.isArray(tar)) {
                    _.forEach(function (target) {
                        fetchConditions.push(target);
                    })
                } else {
                    fetchConditions.push(handler.helpUrl);
                }
            }
        });

        crawler.addFetchCondition(function (queueItem, stateData) {//发现以后决定是否放入加载队列
            var url = queueItem.url;
            var result = false;
            for (var index in fetchConditions) {
                if (fetchConditions[index].test(url)) {
                    result = true;
                    break;
                }
            }
            logger.debug(fetchTimes, 'addFetchCondition', queueItem.url, result ? 'true' : 'false');
            return result;
        });

        crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
            logger.debug(fetchTimes, queueItem.url, response.statusCode, 'fetched', 'UserAgent:', crawler.userAgent);

            //userAgents临时方案
            crawler.userAgent = userAgents[fetchTimes % userAgents.length];

            /*if((fetchTimes % 2) == 0){
             crawler.stop();
             }*/

            //crawler.useProxy = true;
            //crawler.proxyHostname = proxys[fetchTimes % proxys.length].host;
            // crawler.proxyPort = proxys[fetchTimes % proxys.length].port;


            function testTarget(extractor, url) {
                var tar = extractor.target;
                var isTarget = false;
                if (tar) {
                    if (_.isArray(tar)) {
                        for (var i = 0, len = tar.length; i < len; i++) {
                            var t = tar[i];
                            if (t.test && t.test(url)) {
                                isTarget = true;
                                break;
                            }
                        }
                    } else {
                        if (tar.test) {
                            isTarget = tar.test(url);
                        }
                    }
                }

                return isTarget;
            }

            var next = this.wait();
            var $ = cheerio.load(responseBuffer);
            var tasks = [];

            _.forEach(handlers, function (extractor) {
                var isTarget = testTarget(extractor, queueItem.url);
                logger.debug(fetchTimes, queueItem.url, 'fetchcomplete:isTarget', isTarget ? 'true' : 'false');
                if (isTarget) {
                    tasks.push(function (cb) {
                        var data = null;
                        var allowUpdate = extractor.allowUpdate ? true : false;
                        var mergeFields = extractor.mergeFields ? extractor.mergeFields : false;
                        try {
                            data = extractor.handler($, queueItem, responseBuffer, response);
                            if (data) {
                                if (_.isArray(data)) {//保存多条数据
                                    if (data.length > 0) {
                                        var saveTasks = [];
                                        _.forEach(data, function (da) {
                                            saveTasks.push(function (bb) {
                                                myCrawler.saveData(queueItem, da, extractor.keys, extractor.model, allowUpdate, mergeFields, bb);
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
                                        logger.warn(fetchTimes, queueItem.url, 'fetched:emptyArray');
                                        cb(null)
                                    }

                                } else {
                                    if (Object.keys(data).length === 0) {
                                        logger.warn(fetchTimes, queueItem.url, 'fetched:emptyObject');
                                        cb(null)
                                    } else {
                                        myCrawler.saveData(queueItem, data, extractor.keys, extractor.model, allowUpdate, mergeFields, cb);
                                    }

                                }
                            } else {
                                logger.warn(fetchTimes, queueItem.url, 'fetched:hasNoData');
                                cb(null)
                            }

                        } catch (e) {
                            logger.warn(fetchTimes, queueItem.url, 'handler error:', e.message);
                            cb(null);
                        }
                    });

                }// end if target
            })

            function goNext() {
                fetchTimes++;
                if (config.autoSave && fetchTimes % 100 == 0) {
                    crawler.queue.freeze(queueFile, function () {
                        logger.info('queue saved');
                    });
                }

                if (config.exitCount && fetchTimes >= config.exitCount) {
                    crawler.stop();
                }
                next();
            }

            //http://blog.csdn.net/ctbinzi/article/details/39895401
            //并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。
            //如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。其它未执行完的函数的值不会传到最终数据，但要占个位置。
            //并行执行所有满足测试条件的handler，并获得结果集
            if (tasks.length > 0) {
                logger.debug(fetchTimes, queueItem.url, 'fetched:hasTask');
                async.parallel(tasks, function (err, results) {
                    goNext();
                    if (err) logger.error(err)
                });
            } else {
                logger.debug(fetchTimes, queueItem.url, 'fetched:emptyTask');
                goNext();
            }


        });

        crawler.on("queueadd", function (queueItem) {
            logger.debug(fetchTimes, queueItem.url,"queueadd");
        });


        crawler.on("crawlstart", function () {
            crawler.complete = false;
            stime = Date.now();
            logger.info("start");
            crawler.queue.defrost(queueFile, function () {
                logger.info('queue loaded');
            });
            //mongoose.connect(conf.url);

        });


        crawler.on("complete", function () {
            crawler.complete = true;
            logger.info("complete");
            fetchTimes = 0;
            if (fs.existsSync(queueFile)) {
                fs.unlinkSync(queueFile);
                logger.info('queue deleted');
            }

            etime = Date.now();
            logger.info("用时", util.dateDiff(etime - stime));

        });

        crawler.on("stop", function () {
            logger.info("stop");
            fetchTimes = 0;
            if (!crawler.complete) {
                crawler.queue.freeze(queueFile, function () {
                    logger.info('queue saved');
                    setTimeout(function () {
                        logger.info('exit');
                        process.exit(0);
                    }, 999);
                });
            }
        });

        crawler.on("fetchheaders", function (queueItem, response) {
            logger.debug(fetchTimes, queueItem.url, 'fetchheaders', response.statusCode);
        });

        crawler.on("fetchdataerror", function (queueItem, response) {
            logger.error(fetchTimes, queueItem.url, 'fetchdataerror', response.statusCode);
        });

        crawler.on("fetchtimeout", function (queueItem, response) {
            logger.warn(fetchTimes, queueItem.url, 'fetchtimeout');
        });

        crawler.on("fetcherror", function (queueItem, response) {
            logger.error(fetchTimes, queueItem.url, 'fetcherror', response.statusCode);
        });
        crawler.on("fetch404", function (queueItem, response) {
            logger.error(fetchTimes, queueItem.url, 'fetch404', response.statusCode);
        });
        crawler.on("fetch410", function (queueItem, response) {
            logger.error(fetchTimes, queueItem.url, 'fetch410', response.statusCode);
        });

        crawler.on("fetchclienterror", function (queueItem, response) {
            logger.error(fetchTimes, queueItem.url, 'fetchclienterror', response.statusCode);
        });

        crawler.on("queueerror", function (error, queueItem) {
            logger.error(fetchTimes, queueItem.url, 'queueerror', error.message);
        });

        crawler.on("notmodified", function (queueItem, response, cacheObject) {
            logger.warn(fetchTimes, queueItem.url, 'notmodified', response.statusCode);
        });

        crawler.on("fetchredirect", function (queueItem, redirectQueueItem, response) {
            logger.warn(fetchTimes, queueItem.url, 'fetchredirect', redirectQueueItem.url, response.statusCode);
        });

        crawler.on("discoverycomplete", function (queueItem, resources) {
            logger.debug(fetchTimes, queueItem.url, 'discoverycomplete', resources);
        });


        return crawler;
    }
}


//module.exports = myCrawler;
var EX = {
    crawler: null,
    job: null,
    createCrawler: function () {
        return this;
    },
    start: function () {
        if (!this.crawler || !this.crawler.running) {
            this.crawler = myCrawler.createCrawler();
            this.crawler.start();
        }

        var self = this;
        if (config.cron && !this.job) {
            this.job = new cronJob(config.cron, function () {
                if (!self.crawler.running) {
                    logger.info('定时启动爬虫');
                    self.crawler = myCrawler.createCrawler();
                    self.crawler.start();
                }
            });
            logger.info("启动定时任务");
            this.job.start();
        }
    }
}

process.on('SIGINT', function () {
    // pm2 stop
    logger.warn('SIGINT');
    if (EX.crawler && !EX.crawler.complete) {
        EX.crawler.stop();
    } else {
        process.exit(0);
    }
});

module.exports = EX
