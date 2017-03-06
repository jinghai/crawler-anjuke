/**
 * Created by yneos on 2017/1/1.
 * 大众点评_行业
 *
 */

var extractor = {
    name: '大众点评_分类',
    target: /^http:\/\/www\.dianping\.com\/shopall\/(\d+)\/0$/g,
    //helpUrl:/http:\/\/www\.dianping\.com\/[a-z]+$/g,//打开可抓全国
    schema: {
        name: String,//
        code: String,//
        parentCode: String,
        level: Number,//等级【1-行业（channel），2-行业细分（type），3-品牌（branch）】

    },
    keys: ['code'],
    //允许更新
    //allowUpdate: true,
    //返回一个数据对象或数组
    handler: function ($, queueItem, responseBuffer, response) {
        var blocks = $('div.box.shopallCate');
        var typeEl = blocks[0];
        if (!typeEl) {
            return null;
        }
        var resultList = [];
        var listEl = $(typeEl).find('.list');
        for (var i = 0; i < listEl.length; i++) {
            var list = $(listEl[i]);
            var hangyeEl = $(list).find('dt>a');
            var hangyeName = hangyeEl.text();
            var hangyeUrl = hangyeEl.attr("href").split('/');///search/category/1/40
            var hangyeCode = hangyeUrl[hangyeUrl.length - 1];
            //行业（频道）
            resultList.push({
                name: hangyeName,
                code: hangyeCode,//
                parentCode: '-1',
                level: 1,//等级【1-行业，2-行业细分，3-品牌】
            });

            //行业细分
            var xfListEl = $(list).find('dd>ul>li>a');
            for(var j=0;j<xfListEl.length;j++){
                var xf = $(xfListEl[j]);
                var xfName = xf.text();
                var xfUrl = xf.attr("href").split('/');
                var xfCode = xfUrl[xfUrl.length-1];
                var obj = {
                    name: xfName,
                    code: xfCode,//
                    parentCode: hangyeCode,
                    level: 2,//等级【1-行业，2-行业细分，3-品牌】
                }
                resultList.push(obj);
            }


        }
        //console.log(resultList)
        return resultList;
    }
}

module.exports = extractor;