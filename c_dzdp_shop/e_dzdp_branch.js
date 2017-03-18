/**
 * Created by yneos on 2017/1/1.
 * 大众点评_商户
 *
 */

var extractor = {
    name: '大众点评_分类',
    target: [
        {
            test: function (url) {
                //http://www.dianping.com/search/category/1/55/g6844
                //剔除多余网址，含：m n o # 符号的不爬
                var t = url.split('/');
                var str = t[t.length - 1];
                var r = /(m+|n+|o+|#+|q+|d+)/g
                if (r.test(str)) {
                    return false;
                }
                str = t[t.length - 2];
                //以下分类页面样式不同
                if(str==="55" || str==="70"|| str==="90"|| str==="40"){
                    return false;
                }

                var bigCode = "";//频道
                var smallCoce = "";//分类

                var regString = "^http:\/\/www\.dianping\.com\/search\/category\/1\/";//上海
                bigCode = bigCode?bigCode:"(\\d+)";
                smallCoce = smallCoce?"\/"+smallCoce:"\/g";
                regString = regString+bigCode+smallCoce;
                var regObj = new RegExp(regString);
                return regObj.test(url);
            }
        }
    ],
    schema: {
        name: String,//
        code: String,//
        parentCode: String,
        level: Number,//等级【1-行业（channel），2-行业细分（type），3-品牌（branch）】

    },
    keys: ['code'],
    times: 0,
    //允许更新
    //allowUpdate: true,
    //mergeFields:[],
    //返回一个数据对象或数组
    handler: function ($, queueItem, responseBuffer, response) {
        var rets = [], channel, channelCode, category, categoryCode;

        //http://www.dianping.com/search/category/1/10/g24645r875
        var t = queueItem.url.split('http://www.dianping.com/search/category/')[1];
        t = t.split('/');// 1/10/g24645r875
        channelCode = t[1];
        channelCode = channelCode == 0 ? null : channelCode;
        if (channelCode) {
            channel = $('a.current-category.J-current-category').text();
        }

        function getCode(url){
            var str = url.split('/');
            str = str[str.length-1];
            //由于分类是g开头，位置是r(区)或c(县)开头，所以要去掉r或c后的字串
            str = str.split('r')[0];
            str = str.split('c')[0];
            str = str.split('u')[0];
            return str;
        }

        //分类
        if (channelCode) {
            var el = this.getNavigationEl($, "分类:");
            if (el) {
                var curr = el.find('#classfy>a.cur');
                category = curr.text().trim();
                category = category === '不限' ? null : category;
                if (category) {
                    categoryCode = curr.attr('href');
                    categoryCode = getCode(categoryCode);
                    //品牌
                    var subCurr = el.find('#classfy-sub>a');
                    subCurr.each(function(){
                        var el = $(this);
                        var branch,branchCode,level=3;
                        branch = el.text().trim();
                        branch = branch === '不限' ? null : branch;
                        if(branch){
                            branchCode = el.attr("href");
                            branchCode = getCode(branchCode);
                            rets.push({
                                name: branch,
                                code: branchCode,
                                parentCode: categoryCode,
                                level: level,
                            })
                        }
                    })
                }
            }
        }
        //测试用例
        // http://www.dianping.com/search/category/1/10/g132
        // http://www.dianping.com/search/category/1/10/g132r801
        // http://www.dianping.com/search/category/1/10/g132c3580
        // http://www.dianping.com/search/category/1/10/g132r1109u1325

        return rets;
    },
    //根据name获取搜素条件的外层Div
    getNavigationEl: function ($, name) {
        var ret = null;
        var el = $('div.nav-category');
        for (var i = 0; i < el.length; i++) {
            var div = $(el[i]);
            var str = div.find('h4').text();
            if (name === str) {
                ret = div;
                break;
            }
        }
        return ret;
    }

}

module.exports = extractor;
