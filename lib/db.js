/**
 * Created by Administrator on 2017/1/12.
 */
var mongoose = require('mongoose');
//使用环境自己的Promise
mongoose.Promise = global.Promise;

var hasInit = false;



var db = {
  conn:null,
  init:function(config) {
    if (this.conn) return;

    var conf = config.db;

    if(conf.debug) mongoose.set('debug', true);

    mongoose.connect(conf.connStr);

  }

}

module.exports = function(config){
    if (hasInit) return mongoose;
    var conf = config.db;
    if(conf.debug) mongoose.set('debug', true);
    mongoose.connect(conf.connStr);
    hasInit = true;
    return mongoose;
};