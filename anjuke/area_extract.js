/**
 * Created by yneos on 2017/1/1.
 */

var extractor = {
  //提取器名称，对应数据库表名
  name: 'area',//板块
  //网页是否由它处理的依据，如匹配区域网址 http[s]://shanghai.anjuke.com/market[/]...
  target: /^http(s?):\/\/shanghai\.anjuke\.com\/market(\/?)/i,
  schema: {
    url: String,
    name: String,//同板块名称
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
    point: Object,//坐标
  },
  times: 0,
  handler: function ($, queueItem, responseBuffer, response, crawler) {
    //上海房产网 > 上海房价
    //上海房产网 > 上海房价 > 徐汇房价 > 徐家汇房价
    //上海房产网 > 上海房价 > 徐汇房价 > 淮海西路房价
    //丹东房产网 > 丹东房价 > 振兴房价 > 振兴房价
    var regionRelation = $(".crumb").text().replace(/房价/g, '').replace(/\s/g, '').split(">");
    regionRelation.shift();
    //-->[上海,徐汇,徐家汇]

    var area=null, district=null, city=null;
    city = regionRelation[0];
    if (regionRelation.length > 1) {
      district = regionRelation[1];
    }
    if (regionRelation.length > 2) {
      area = regionRelation[2];
    }
    var name = regionRelation[regionRelation.length - 1];


    var priceNode = $("div.trendR");
    var price = priceNode.find("h2.highLight>em").eq(0).text();

    //环比month-on-month
    var momNode = priceNode.find("h2>i").eq(0);
    var momUpDown = momNode.hasClass("up") ? "up" : "down";
    //0.53% ↑
    var mom = momNode.text().split("%")[0];
    //同比year-on-year
    var yoyNode = priceNode.find("h2>i").eq(1);
    var yoyUpDown = yoyNode.hasClass("up") ? "up" : "down";
    //0.53% ↑
    var yoy = yoyNode.text().split("%")[0];

    //http://shanghai.anjuke.com/market/lingangxincheng/
    var py = queueItem.url.split("/")[4] || "";
    if(!py){
      py = queueItem.url.split(".")[0].split("/")[2]
    }
    var letter = py.substr(0, 1).toUpperCase();

    var date = new Date();

    var result = {
      url: queueItem.url,
      name: name,
      area: area,
      district: district,
      city: city,
      year: date.getFullYear(),
      month: date.getMonth()+1,
      price: price,
      mom: mom,
      momUpDown: momUpDown,
      yoy: yoy,//环比
      yoyUpDown: yoyUpDown,
      py: py,
      letter: letter,
      point: null,
    }


    this.times++
    if (this.times > 0) {
      console.log(this.times);
      crawler.stop();
    }
    //console.log(regenTarget);
    return result;
  }
}

module.exports = extractor;