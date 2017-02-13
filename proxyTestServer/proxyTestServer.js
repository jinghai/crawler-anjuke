/**
 * Created by Administrator on 2017/2/9.
 */
var async = require('async');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

var dburl = 'mongodb://192.168.2.56/_crawler';
var tableName = 'proxys';

var db = mongoose.createConnection(dburl);

db.once('open', function callback() {
    console.log('open ok')
});

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
    最后验证时间: Date
}
//http://www.nodeclass.com/api/mongoose.html#schema_Schema
var schema = new mongoose.Schema(Schema, {strict: false});
var proxyModel = db.model(tableName, schema);


function getHost(callback) {
    //怎么就查不到呢？
    proxyModel
        .findOne({
            匿名度:'高匿',
            国家:'中国',
            $or: [
                {最后验证时间: null}
            ]
        })
        .then(function (proxy) {
            console.log(proxy)
        })
}

function testHost(host, callback) {

}

function updateHost(callback) {

}

getHost();

/*
 ProxyModel
 .find({ occupation: /host/ })
 .where('name.last').equals('Ghost')
 .where('age').gt(17).lt(66)
 .where('likes').in(['vaporizing', 'talking'])
 .limit(10)
 .sort('-occupation')
 .select('name occupation')
 .exec(callback);*/

/*
 var result = yield User.find(
 {
 $or : [ //多条件，数组
 {nick : {$regex : reg}},
 {email : {$regex : reg}}
 ]
 },
 {
 password : 0
 },
 {
 sort : { _id : -1 },
 limit : 100
 }
 );*/

//Tank.update({ _id: id }, { $set: { size: 'large' }}, callback);

/*
 Tank.findByIdAndUpdate(id, { $set: { size: 'large' }}, function (err, tank) {
 if (err) return handleError(err);
 res.send(tank);
 });*/
