/**
 * Created by yneos on 2017/1/1.
 * 大众点评_商区
 *
 */

var extractor = {
    name: '大众点评_商区',
    target: /^http:\/\/www\.dianping\.com\/shopall\/(\d+)\/0$/g,
    //helpUrl:/http:\/\/www\.dianping\.com\/[a-z]+$/g,
    schema: {
        name: String,//
        code: String,//
        parentCode: String,
        level: Number,//等级【1-行业，2-行业细分，3-品牌】
        city: String,
    },
    keys: ['code'],
    //允许更新
    //allowUpdate: true,
    //返回一个数据对象或数组
    handler: function ($, queueItem, responseBuffer, response) {
        console.log(queueItem.url);
        var blocks = $('div.box.shopallCate');
        var typeEl = null;
        if (!blocks) {
            return null;
        }

        var cityStr = $('h1.shopall>strong').text();//上海生活指南地图
        if (!cityStr)    return null;
        var city = cityStr.split('生活指南地图')[0];

        for(var i=0;i<blocks.length;i++){
            var tempEl =  $(blocks[i]);
            var titleEl = tempEl.find('h2');
            var title = titleEl.text();
            if(title==='商区'){
                typeEl =  $(blocks[i]);
                break;
            }

        }

        if(!typeEl) return null;



        var resultList = [];
        var listEl = $(typeEl).find('.list');
        for (var i = 0; i < listEl.length; i++) {
            var list = $(listEl[i]);

            var el = $(list).find('dt>a');
            var name = el.text();
            var url = el.attr("href").split('/');///search/category/1/40
            var code = url[url.length - 1];
            //行业（频道）
            resultList.push({
                name: name,
                code: code,//
                parentCode: '0',
                level: 1,//等级【1，2，3】
                city:city
            });

            //行业细分
            var xfListEl = $(list).find('dd>ul>li>a');
            for (var j = 0; j < xfListEl.length; j++) {
                var xf = $(xfListEl[j]);
                var xfName = xf.text();
                var xfUrl = xf.attr("href").split('/');
                var xfCode = xfUrl[xfUrl.length - 1];
                var obj = {
                    name: xfName,
                    code: xfCode,//
                    parentCode: code,
                    level: 2,//等级【1-行业，2-行业细分，3-品牌】,
                    city:city
                }
                resultList.push(obj);
            }


        }

        //console.log(resultList)
        return resultList;
    }
}

module.exports = extractor;