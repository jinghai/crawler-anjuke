/**
 * Created by yneos on 2017/1/29.
 */
var util = require('./util.js');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dbUrl = 'mongodb://192.168.2.56/_crawler';
var tableName = 'proxys';
var db = mongoose.createConnection(dbUrl);
var schema = new mongoose.Schema({
    ip: String,
    port: String,
}, {strict: true});
var proxyModel = db.model(tableName, schema);

//todo:增加limit:50 随机选取
function getProxy(callback) {
    callback = callback ? callback : util.empetyFunction;
    proxyModel
        .find({
            code: 200,
            successRate: {$gte: 0.5}
        }).then(function (proxys) {
            callback(null,proxys);
        }).catch(function (err) {
            callback(err);
        })
}
module.exports = {
    getProxy:getProxy
};

