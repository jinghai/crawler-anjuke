/**
 * Created by yneos on 2017/1/1.
 */

var extractor = {
  name: '安居客_上海_商铺出租',
  //  http://sh.sp.anjuke.com/zu/33858491/
  //target: /^http:\/\/sh\.sp\.anjuke\.com\/zu\/(\d+)\/$/,
  // http://sh.sp.anjuke.com/zu/ http://sh.sp.anjuke.com/zu/p2
  //helpUrl:/^http:\/\/sh\.sp\.anjuke\.com\/zu(\/?|\/p\d+)$/,
    target:/^http:\/\/sh\.sp\.anjuke\.com\/zu(\/?|\/p\d+)$/,
  schema: {
    url: String,
    anjukeId:String,
    name: String,
    area: String,
    district: String,
    city: String,
    year: String,
    month: String,
    price: Number,
    mom: Number,
    momUpDown: String,
    point: Object,
  },
  //数据唯一标识(字段值连接后md5存放于__k)，若数据已存在不做更新
  keys: ["name", "year", "month"],

  //无返回值框架不会保存，可使用new this.model(data)自行操作
  handler: function ($, queueItem, responseBuffer, response) {


    var result = {
      url: queueItem.url,
      anjukeId:anjukeId,
      name: name,
      area: area,
      district: district,
      city: city,
      year: date.getFullYear(),
      month: date.getMonth() + 1,//getMonth 0~11
      price: price,
      mom: mom,
      momUpDown: momUpDown,
      point: {lat:lat,lng:lng},
    }

    //this.crawler.stop();
    console.log(queueItem.url);
    return null;
  }
}

module.exports = extractor;