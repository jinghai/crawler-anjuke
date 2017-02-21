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
        name: String,
        code: String,//12位代码
        shortCode:String,//短代码
        year: String,
        villageType: String,//城乡分类
        isDirectControl: Boolean,//是否直辖市
        level: Number,//[1-5]
        tag: String,//[province,省,直辖市|city,市,市辖区|county,市辖区,区,区县|town,街道|village,社区] 比较上海和河北石家庄
        parentCode:String//-1为根
    },
    keys:['code','year'],
    //返回一个数据对象或数组
    handler: function ($, queueItem, responseBuffer, response) {
        var str = queueItem.url.split("/tjyqhdmhcxhfdm/");//http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/ 2015/31/02/30/310230101.html
        str = str[1].split("/");//2015/21/01/02/210102001.html
        str.shift();
        var level = 1;
        if (str[0] !== "index.html") {
            level = str.length + 1;
        }

        var reslut = [];
        //console.log('level',level)
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
        return reslut;
    },
    //http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/index.html
    getL1: function ($,url) {
        var str = url.split("/tjyqhdmhcxhfdm/");
        str = str[1].split("/");//2015/21/01/02/210102001.html
        var year = str[0];

        var els = $('table.provincetable>tr.provincetr>td>a');
        var datas = [];
        for (var i = 0, len = els.length; i < len; i++) {
            var el = $(els[i]);
            var name = el.text();
            var code = el.attr("href").split(".")[0];//11.html
            var isDirectControl = false;
            if(name.indexOf("市")>0){
                isDirectControl = true;
            }
            var data = {
                name: name,
                code: code+'0000000000',
                shortCode:code,
                parentCode:-1,
                year: year,
                villageType: null,
                isDirectControl: isDirectControl,
                level: 1,//[1-5]
                tag: 'province',
            }
            datas.push(data);
        }
        //console.log(1,'-->',url,datas);
        //this.crawler.stop();
        return datas;

    },
    //http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/11.html
    getL2: function ($,url) {
        var str = url.split("/tjyqhdmhcxhfdm/");
        str = str[1].split("/");//2015/21/01/02/210102001.html
        var year = str[0];
        var datas = [];

        var rows = $('table.citytable>tr.citytr');
        for(var i = 0, len = rows.length; i < len; i++){
            var row = rows[i];
            var cells = $(row).find('td');

            var name = $(cells[1]).text();
            var code = $(cells[0]).text();
            var shortCode = code.substr(0,4);
            var parentCode = code.substr(0,2);
            var data = {
                name: name,
                code: code,
                shortCode:shortCode,
                parentCode:parentCode,
                year: year,
                villageType: null,
                isDirectControl: null,
                level: 2,//[1-5]
                tag: 'city',
            }
            datas.push(data);
        }

        //console.log(2,'-->',url,datas);
        //this.crawler.stop();
        return datas;

    },
    //http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/13/1302.html
    getL3: function ($,url) {
        var str = url.split("/tjyqhdmhcxhfdm/");
        str = str[1].split("/");//2015/21/01/02/210102001.html
        var year = str[0];

        var datas = [];

        var rows = $('table.countytable>tr.countytr');
        for(var i = 0, len = rows.length; i < len; i++){
            var row = rows[i];
            var cells = $(row).find('td');

            var name = $(cells[1]).text();
            var code = $(cells[0]).text();
            var shortCode = code.substr(0,6);
            var parentCode = code.substr(0,4);
            var data = {
                name: name,
                code: code,
                shortCode:shortCode,
                parentCode:parentCode,
                year: year,
                villageType: null,
                isDirectControl: null,
                level: 3,//[1-5]
                tag: 'county'
            }
            datas.push(data);
        }

        //console.log(3,'-->',url,datas);
        //this.crawler.stop();
        return datas;
    },
    //http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/11/01/110101.html
    getL4: function ($,url) {
        var str = url.split("/tjyqhdmhcxhfdm/");
        str = str[1].split("/");//2015/21/01/02/210102001.html
        var year = str[0];

        var datas = [];

        var rows = $('table.towntable>tr.towntr');
        for(var i = 0, len = rows.length; i < len; i++){
            var row = rows[i];
            var cells = $(row).find('td');

            var name = $(cells[1]).text();
            var code = $(cells[0]).text();
            var shortCode = code.substr(0,9);
            var parentCode = code.substr(0,7);
            var data = {
                name: name,
                code: code,
                shortCode:shortCode,
                parentCode:parentCode,
                year: year,
                villageType: null,
                isDirectControl: null,
                level: 4,//[1-5]
                tag: 'town'
            }
            datas.push(data);
        }

        //console.log(4,'-->',url,datas);
        //this.crawler.stop();
        return datas;
    },
    //http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/11/01/01/110101001.html
    getL5: function ($,url) {
        var str = url.split("/tjyqhdmhcxhfdm/");
        str = str[1].split("/");//2015/21/01/02/210102001.html
        var year = str[0];

        var datas = [];
        var rows = $('table.villagetable>tr.villagetr');
        for(var i = 0, len = rows.length; i < len; i++){
            var row = rows[i];
            var cells = $(row).find('td');

            var name = $(cells[2]).text();
            var code = $(cells[0]).text();
            var shortCode = code
            var parentCode = code.substr(0,9);
            var type = $(cells[1]).text();
            var data = {
                name: name,
                code: code,
                shortCode:shortCode,
                parentCode:parentCode,
                year: year,
                villageType: type,
                isDirectControl: false,
                level: 5,//[1-5]
                tag: 'village'
            }
            datas.push(data);
        }

        //console.log(5,'-->',url,datas);
        //this.crawler.stop();
        return datas;
    }
}

module.exports = extractor;