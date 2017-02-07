/**
 * Created by yneos on 2017/1/1.
 * 西刺国内高匿HTTP代理
 * http://www.xicidaili.com/nn/
 */

var extractor = {
    name: '代理服务器',//代理服务器
    target: /^http:\/\/www\.xicidaili\.com\/nn(\/?)/i,
    schema: {
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
    },
    keys: ["ip", "port"],
    //返回一个数据对象或数组
    handler: function ($, queueItem, responseBuffer, response) {

        var rows = $('tr');
        var hosts = [];
        for(var i=0,len=rows.length;i<len;i++){
            var cells = $(rows[i]).find('td');
            var obj = {
                url: queueItem.url,
                ip: $(cells[1]).text(),
                port: $(cells[2]).text(),
                匿名度: $(cells[4]).text(),
                协议: $(cells[5]).text(),
                国家: '中国',
                位置: null,
                速度: null,
                收录时间: new Date(),
                存活时间: null,
                最后验证时间: null
            }
            if(obj.ip && obj.port){
                hosts.push(obj)
            }
        }

        return hosts;
    }
}

module.exports = extractor;