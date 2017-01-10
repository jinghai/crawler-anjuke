/**
 * Created by yneos on 2017/1/1.
 */

var extractor = {
  target : /^http(s?):\/\/shanghai\.anjuke\.com\/market(\/?)/i,
  handler:function($,queueItem, responseBuffer, response){
    //上海房产网 > 上海房价 > 徐汇房价 > 徐家汇房价
    var regionRelation = $(".crumb").text().replace(/房价/g, '').replace(/\s/g, '').split(">");
    regionRelation.shift();

    var regionName = regionRelation[regionRelation.length - 1];

    var priceNode = $("div.trendR");
    var regionPrice = priceNode.find("h2.highLight>em").eq(0).text();

    //环比month-on-month
    var momNode = priceNode.find("h2>i").eq(0);
    var momType = momNode.hasClass("up") ? "up" : "down";
    //0.53% ↑
    var mom = momNode.text().split("%")[0];
    //同比year-on-year
    var yoyNode = priceNode.find("h2>i").eq(1);
    var yoyType = yoyNode.hasClass("up") ? "up" : "down";
    //0.53% ↑
    var yoy = yoyNode.text().split("%")[0];
    var regenTarget = {
      url:queueItem.url,
      regionName: regionName,
      regionPrice: regionPrice,
      regionRelation: regionRelation,
      mom: mom,
      momType: momType,
      yoy: yoy,
      yoyType: yoyType
    }

    console.log(regenTarget);
    return regenTarget;
  }
}

module.exports = extractor;