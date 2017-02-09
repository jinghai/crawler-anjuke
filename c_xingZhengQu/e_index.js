/**
 * Created by yneos on 2017/1/1.
 * 省、代码
 *
 */

var extractor = {
    name: '行政区',
    target: {
        test: function (url) {
            var year = new Date().getFullYear();
            for (var i = year; i > year - 3; i--) {//近两年
                var regString = '^http:\/\/www\.stats\.gov\.cn\/tjsj\/tjbz\/tjyqhdmhcxhfdm\/' + i + '(\/?)';
                var r = new RegExp(regString);

                if (r.test(url)) {
                    console.log(regString, url, i, r.test(url));
                    return true;
                }
            }
            return false;
        }
    },
    schema: {
        名称: String,
        代码: String,
        年: String,
        城乡分类: String,
        是直辖市: Boolean,
        等级: Number,//[1-5]
        分类: String,//[省/直辖市,市/辖区,区/区县,街道,社区]
    },
    //返回一个数据对象或数组
    handler: function ($, queueItem, responseBuffer, response) {
        //http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/21/01/02/210102001.html
        //http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/31/02/30/310230101.html
        var str = queueItem.url.split("/tjyqhdmhcxhfdm/");//2015/21/01/02/210102001.html
        str = str[1].split("/");//
        var year = str[0];
        console.log(year)

        /*var rows = $('tr');
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
         }*/

        return null;
    }
}

module.exports = extractor;