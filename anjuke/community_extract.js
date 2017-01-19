/**
 * Created by yneos on 2017/1/1.
 */

var extractor = {
  //表名
  name: '小区',
  //  http://shanghai.anjuke.com/community/view/1670
  //  http://shanghai.anjuke.com/community/view/
  target: /^http:\/\/shanghai\.anjuke\.com\/community\/view(\/?)/i,
  //正则，加入爬取队列，只为寻找target
  //http://shanghai.anjuke.com/community/p2/
  helpUrl:/^http:\/\/shanghai\.anjuke\.com\/community(\/?)/i,
  schema: {
    url: String,
    name: String,//市-区县-板块 组合名称（无区县、板块不组合）
    area: String,//板块名称
    district: String,//区/县
    city: String,
    year: String,
    month: String,
    price: Number,//均价
    mom: Number,//同比
    momUpDown: String,//同比上升/下降
    yoy: Number,//环比
    yoyUpDown: String,//环比上升/下降
    py: String,//拼音
    letter: String,//拼音首字母
    //point: Object,//坐标
  },
  //数据唯一标识(字段值连接后md5存放于__k)，若数据已存在不做更新
  keys: ["name", "year", "month"],
  model: null,//数据模型对象，运行时注入
  crawler: null,//爬虫对象，运行时注入
  mongoose: null,//数据库对象，运行时注入
  times: 0,
  //无返回值框架不会保存，可使用new this.model(data)自行操作
  handler: function ($, queueItem, responseBuffer, response) {



    this.times++
    if (this.times > 0) {
      //this.crawler.stop();
    }
    //console.log(regenTarget);
    console.log(this.times, queueItem.url);
    //return result;
  }
}

module.exports = extractor;