/**
 * Created by Administrator on 2017/2/9.
 */
var async = require('async');
var request = require('request');
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
    testCount:Number
}
//http://www.nodeclass.com/api/mongoose.html#schema_Schema
var schema = new mongoose.Schema(Schema, {strict: false});
var proxyModel = db.model(tableName, schema);


function getHost(callback) {
    var hour2 = 2*60*60*1000;
    var now = new Date();
    var t1 = now.getTime();
    var t2 = t1-(hour2);//debug 30*1000 hour2
    var before2hour = new Date(t2);

    proxyModel
        .findOne({
            匿名度: '高匿',
            国家: '中国',
            //协议:'HTTP',
            $or: [
                {最后验证时间: null},
                {最后验证时间:{"$lt":before2hour}}
            ]
        })
        .then(function (proxy) {
            logger.debug("getHost",proxy.ip);
            if(!proxy){
                callback('no proxy need to test', proxy);
            }else{
                callback(null, proxy);
            }

        })
}

function testHost(proxy, callback) {
    var host = proxy.ip;
    var port = proxy.port;
    var httptarget = 'http://www.baidu.com/';
    var httpsTarget = 'https://www.baidu.com/';
    var target = proxy.协议==='HTTP'?httptarget:httpsTarget;
    var startTime = new Date();
    request.get(target, {
        host: host, port: port, timeout: 3000, headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            //'Connection': 'close'
        }
    }, function (error, response, body) {
        var endTime = new Date();
        var speed = endTime.getTime() - startTime.getTime();
        if (!error && response.statusCode == 200) {
            proxy.state = 'available';
        } else {
            proxy.state = 'unavailable';
        }

        proxy.errorMessage = error?error.message:'';
        proxy.code =  response?response.statusCode:-1
        proxy.最后验证时间 = endTime;
        proxy.speed = speed;
        proxy.testCount = proxy.testCount?proxy.testCount++:1;

        logger.info("test",proxy.ip,proxy.协议,target,proxy.code,proxy.errorMessage,proxy.state,speed);
        callback(null,proxy);
    })
}

function updateHost(proxy, callback) {
    proxyModel
        .findByIdAndUpdate(
        {'_id': proxy._id},
        {$set: {
            state: proxy.state,
            最后验证时间:proxy.最后验证时间,
            errorMessage:proxy.errorMessage,
            code:proxy.code,
            speed:proxy.speed,
            testCount:proxy.testCount
        }},
        function (err, doc) {
            if (err) {
                callback(err);
            } else {
                logger.debug("updateHost",doc.ip);
                callback(null, doc);
            }
        }
    );
}

function findOneAndTest(callback){
    //多个函数依次执行，且前一个的输出为后一个的输入
    //如果中途出错，后面的函数将不会被执行。
    async.waterfall([getHost,testHost, updateHost], function (err, result) {
        if(err){
            callback(err)
        }else{
            callback(null,result);
        }
    });
}

//var count1 = 0;
//相当于while，但其中的异步调用将在完成后才会进行下一次循环
async.whilst(
    function() { return true },
    function(cb) {
        setTimeout(function(){
            findOneAndTest(function(err,result){
                if(err) logger.info('whilst',err);
                cb(null);
            })
        }, 300);
    },
    function(err) {
        logger.info('whilst','end');
    }
);


/**
 * Todo:
 * 查询没有最后测试时间 或 最后测试时间在2小时以前的数据
 * 测试区分http和https
 * 记录测试次数
 * 记录响应时间
 * 写成循环任务（单条/并发）
 * 日志
 */
