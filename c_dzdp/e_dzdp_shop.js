/**
 * Created by yneos on 2017/1/1.
 * 省、代码
 *
 */

var extractor = {
    name: '大众点评_商户',
    target: /^http:\/\/www\.dianping\.com\/search\/category\/1\/0\/r835(p?)/g,
    schema: {
        name: String,
        地址:String,
        一级分类:String,//大类 行业
        二级分类:String,//子类 行业细分
        三级分类:String,//品牌 品牌
        商圈:String,//
        子商圈:String,//
        行政区:String,//
        子行政区:String,//
        地铁线路:String,//
        地铁站:String,//
    },
    //返回一个数据对象或数组
    handler: function ($, queueItem, responseBuffer, response) {
        console.log(queueItem.url);
        return null;
    }
}

module.exports = extractor;