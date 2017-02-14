/**
 * Created by yneos on 2017/1/1.
 * 西刺国内高匿HTTP代理
 * http://www.xicidaili.com/nn/
 */

var extractor = {
    name: 'proxys',//代理服务器
    target: /^http:\/\/www\.kuaidaili\.com\/free\/(\/?)/g,
    schema: {
        url: String,
        ip: String,
        port: String,
    },
    keys: ["ip", "port"],
    //返回一个数据对象或数组
    handler: function ($, queueItem, responseBuffer, response) {
        //次站防爬--js云顿

        return null;
    }
}

module.exports = extractor;