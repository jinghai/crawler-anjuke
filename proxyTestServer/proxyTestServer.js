/**
 * Created by Administrator on 2017/2/9.
 */
var async = require('async');
var request = require('request');
var Agent = require('socks5-http-client/lib/Agent');
var logger = require("../lib/logger.js")('info', 'proxyTestServer');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);


var dburl = 'mongodb://192.168.2.56/_crawler';
var tableName = 'proxys';
var db = mongoose.createConnection(dburl);

var Schema = {
    url: String,
    ip: String,
    port: String,
    匿名度: String,
    协议: String,
    国家: String,
    位置: String,
    速度: Number,
    收录时间: Date,
    存活时间: Number,
    最后验证时间: Date,
    testCount: Number
}
//http://www.nodeclass.com/api/mongoose.html#schema_Schema
var schema = new mongoose.Schema(Schema, {strict: false});
var proxyModel = db.model(tableName, schema);


function getHost(callback) {
    var hour2 = 6 * 60 * 60 * 1000;
    var now = new Date();
    var t1 = now.getTime();
    var t2 = t1 - (hour2);//debug 30*1000 hour2
    var before2hour = new Date(t2);

    proxyModel
        .findOne({
            匿名度: '高匿',
            国家: '中国',
            //协议:'HTTP',
            $or: [
                {最后验证时间: null},
                {最后验证时间: {"$lt": before2hour}}
            ]
        })
        .then(function (proxy) {
            if (proxy) {
                logger.debug("getHost", proxy.ip);
                callback(null, proxy);
            } else {
                //logger.warn("getHost", 'no data found to test');
                callback('no data found to test');
            }


        }).catch(function (err) {
            logger.error("getHost", err);
            callback(err);
        })
}


// 如何设置代理 http://blog.csdn.net/yuan882696yan/article/details/25052469
function testHost(proxyEntity, callback) {
    var host = proxyEntity.ip;
    var port = proxyEntity.port;
    var httpTarget = 'http://www.baidu.com/';
    var httpsTarget = 'https://www.baidu.com/';
    var target = proxyEntity.协议 === 'HTTP' ? httpTarget : httpsTarget;
    var startTime = new Date();

    var option = {
        followRedirect: false,
        timeout: 3000, headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36 ',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Connection': 'close'
        }
    }
    if (proxyEntity.协议 === 'HTTP' || proxyEntity.协议 === 'HTTPS') {
        option.proxy = (proxyEntity.协议 === 'HTTP' ? "http://" : "https://") + host + ":" + port;
    } else {//socks5
        option.agentClass = Agent;
        option.agentOptions = {socksHost: host, socksPort: port}
    }

    request.get(target, option, function (error, response, body) {
        var endTime = new Date();
        var speed = endTime.getTime() - startTime.getTime();

        proxyEntity.errorMessage = error ? error.message : '';
        proxyEntity.code = response ? response.statusCode : -1
        proxyEntity.最后验证时间 = endTime;
        proxyEntity.speed = speed;
        proxyEntity.testCount = proxyEntity.testCount ? ++proxyEntity.testCount : 1;

        if (!error && response.statusCode == 200) {
            proxyEntity.state = 'available';
            proxyEntity.successCount = proxyEntity.sucessCount ? ++proxyEntity.sucessCount : 1;
            proxyEntity.successRate = proxyEntity.successCount / proxyEntity.testCount;
        } else {
            proxyEntity.state = 'unavailable';
        }

        logger.info("test", target, option.proxy, proxyEntity.code, proxyEntity.errorMessage, proxyEntity.state, speed);


        callback(null, proxyEntity);
    })
}

function updateHost(proxy, callback) {
    proxyModel
        .findByIdAndUpdate(
        {'_id': proxy._id},
        {
            $set: {
                state: proxy.state,
                最后验证时间: proxy.最后验证时间,
                errorMessage: proxy.errorMessage,
                code: proxy.code,
                speed: proxy.speed,
                testCount: proxy.testCount,
                successCount:proxy.successCount,
                successRate:proxy.successRate
            }
        },
        function (err, doc) {
            if (err) {
                callback(err);
            } else {
                logger.debug("updateHost", doc.ip);
                callback(null, doc);
            }
        }
    );
}

function findOneAndTest(callback) {
    //多个函数依次执行，且前一个的输出为后一个的输入
    //如果中途出错，后面的函数将不会被执行。
    async.waterfall([getHost, testHost, updateHost], function (err, result) {
        if (err) {
            callback(err)
        } else {
            callback(null, result);
        }
    });
}

//var count1 = 0;
//相当于while，但其中的异步调用将在完成后才会进行下一次循环
//异常时停止循环
async.whilst(
    function () {
        return true
    },
    function (cb) {
        setTimeout(function () {
            findOneAndTest(function (err, result) {
                //if(err) logger.error('whilst',err);
                cb(null); //忽略异常继续循环
            })
        }, 300);
    },
    function (err) {
        logger.error('whilst', err);
    }
);


/**
 * Todo:
 * 测试区分http和https 和socek
 * 记录测试次数
 * 记录成功次数
 * 计算成功率
 * 写成循环任务（单条/并发）
 */
