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
        var str = queueItem.url.split("/tjyqhdmhcxhfdm/");//http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/31/02/30/310230101.html
        str = str[1].split("/");//2015/21/01/02/210102001.html
        var year = str.shift();//str = 21/01/02/210102001.html
        var level = 1;
        if (str[0] !== "index.html") {
            level = str.length + 1;
        }
        var reslut = null;

        switch (level) {
            case 1:
                reslut = this.getL1($,queueItem.url);
                break;
            case 2:
                reslut = this.getL2($,queueItem.url)
                break;
            case 3:
                reslut = this.getL3($,queueItem.url)
                break;
            case 4:
                reslut = this.getL4($,queueItem.url)
                break;
            case 5:
                reslut = this.getL5($,queueItem.url)
                break;
        }
        return {};
    },
    getL1: function ($,url) {
        var els = $('table.provincetable>tr.provincetr>td>a');
        var datas = [];
        for (var i = 0, len = els.length; i < len; i++) {
            var el = $(els[i]);
            var name = el.text();
            var code = el.attr("href").split(".")[0];//11.html
            var isZXS = false;
            if(name.indexOf("市")>0){
                isZXS = true;
            }
            var data = {
                名称: name,
                代码: code,
                年: new Date().getFullYear(),
                城乡分类: null,
                是直辖市: isZXS,
                等级: 1,//[1-5]
                分类: '省/直辖市/自治区'
            }
            datas.push(data);
        }
        return datas;

    },
    getL2: function ($,url) {
        var datas = [];
        var rows = $('table.citytable>tr.citytr');

        for(var i = 0, len = rows.length; i < len; i++){
            var row = rows[i];
            var cells = $(row).find('td');
            var el = $(cells[1]).find('a');
            var name = el.text();
            var code = el.attr("href").split(".")[0].split('/')[1];//11/1101.html
            var data = {
                名称: name,
                代码: code,
                年: new Date().getFullYear(),
                城乡分类: null,
                是直辖市: false,
                等级: 2,//[1-5]
                分类: '市/辖区'
            }
            datas.push(data);
        }
        return datas;

    },
    getL3: function ($,url) {
        var datas = [];
        var rows = $('table.countytable>tr.countytr');

        for(var i = 0, len = rows.length; i < len; i++){
            var row = rows[i];
            var cells = $(row).find('td');
            var el = $(cells[1]).find('a');
            var name = el.text();
            var code = el.attr("href").split(".")[0].split('/')[1];//01/110101.html
            var data = {
                名称: name,
                代码: code,
                年: new Date().getFullYear(),
                城乡分类: null,
                是直辖市: false,
                等级: 3,//[1-5]
                分类: '区/区县'
            }
            datas.push(data);
        }

        return datas;
    },
    getL4: function ($,url) {
        var datas = [];
        var rows = $('table.towntable>tr.towntr');

        for(var i = 0, len = rows.length; i < len; i++){
            var row = rows[i];
            var cells = $(row).find('td');
            var el = $(cells[1]).find('a');
            var name = el.text();
            var code = el.attr("href").split(".")[0].split('/')[1];//01/110101.html
            var data = {
                名称: name,
                代码: code,
                年: new Date().getFullYear(),
                城乡分类: null,
                是直辖市: false,
                等级: 4,//[1-5]
                分类: '街道'
            }
            datas.push(data);
        }

        return datas;
    },
    getL5: function ($,url) {
        var datas = [];
        var rows = $('table.villagetable>tr.villagetr');

        for(var i = 0, len = rows.length; i < len; i++){
            var row = rows[i];
            var cells = $(row).find('td');

            var name = $(cells[2]).text();
            var code = $(cells[0]).text();
            var type = $(cells[1]).text();
            var data = {
                名称: name,
                代码: code,
                年: new Date().getFullYear(),
                城乡分类: type,
                是直辖市: false,
                等级: 5,//[1-5]
                分类: '社区'
            }
            datas.push(data);
        }

        return datas;
    }
}

module.exports = extractor;