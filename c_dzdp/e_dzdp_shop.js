/**
 * Created by yneos on 2017/1/1.
 * 省、代码
 *
 */

var extractor = {
    name: '大众点评_商户',
    target: /^http:\/\/www\.dianping\.com\/search\/category\/1\/0\/r835(p?)/g,
    schema: {
        name: String,//商户名称
        dp_id: Number,//大众点评id
        地址: String,//文字地址

        行业: String,// 一级分类【逗号表达式】
        行业细分: String,//一级分类【逗号表达式】
        品牌: String, //三级分类【逗号表达式】
        商圈: String,//
        子商圈: String,//
        行政区: String,//
        子行政区: String,//
        地铁线: String,//
        地铁站: String,//
    },
    keys: ['id'],
    //强制更新，运行过程中可动态改变
    allowUpdate: true,
    //返回一个数据对象或数组
    handler: function ($, queueItem, responseBuffer, response) {
        console.log(queueItem.url);
        return null;
    }
}

module.exports = extractor;