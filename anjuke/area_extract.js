/**
 * Created by yneos on 2017/1/1.
 */

var extractor = {
    //表名
    name: '安居客-上海-板块均价',//板块
    //  网页是否由它处理的依据，如匹配区域网址 http[s]://shanghai.anjuke.com/market[/]...
    target: /^http:\/\/shanghai\.anjuke\.com\/market(\/?)/i,
    //target: /^http:\/\/shanghai\.anjuke\.com\/market\/$/i,
    //正则，加入爬取队列，只为寻找target
    //helpUrl:/^http:\/\/shanghai\.anjuke\.com\/market(\/?)/i,
    schema: {
        url: String,
        name: String,//市-区县-板块 组合名称（无区县、板块不组合）
        area: String,//板块名称
        district: String,//区/县
        city: String,
        year: String,
        month: String,
        price: Number,//均价
        mom: Number,//同比
        momUpDown: String,//同比上升/下降
        yoy: Number,//环比
        yoyUpDown: String,//环比上升/下降
        py: String,//拼音
        letter: String,//拼音首字母
        //point: Object,//坐标
    },
    //数据唯一标识(字段值连接后md5存放于__k)，若数据已存在不做更新
    keys: ["name", "year", "month"],
    //model: null,//数据模型对象，运行时注入
    //crawler: null,//爬虫对象，运行时注入
    //mongoose: null,//数据库对象，运行时注入
    times: 0,
    //无返回值框架不会保存，可使用new this.model(data)自行操作
    handler: function ($, queueItem, responseBuffer, response) {
        //上海房产网 > 上海房价
        //上海房产网 > 上海房价 > 徐汇房价 > 徐家汇房价
        //上海房产网 > 上海房价 > 徐汇房价 > 淮海西路房价
        //丹东房产网 > 丹东房价 > 振兴房价 > 振兴房价
        var regionRelation = $(".crumb").text().replace(/房价/g, '').replace(/\s/g, '').split(">");
        regionRelation.shift();
        //-->[上海,徐汇,徐家汇]

        var area = null, district = null, city = null;
        city = regionRelation[0];
        if (regionRelation.length > 1) {
            district = regionRelation[1];
        }
        if (regionRelation.length > 2) {
            area = regionRelation[2];
        }
        var name = city;
        if (district) name += "-" + district;
        if (area) name += "-" + area;


        var priceNode = $("div.trendR");
        var price = priceNode.find("h2.highLight>em").eq(0).text();
        if (price.indexOf("暂无") > 0) {
            price = -1;
        }
        var momUpDown, mom, yoyUpDown, yoy;
        if (price != -1) {
            //环比month-on-month
            var momNode = priceNode.find("h2>i").eq(0);
            momUpDown = momNode.hasClass("up") ? "up" : "down";
            //0.53% ↑
            mom = momNode.text().split("%")[0];
            //同比year-on-year
            var yoyNode = priceNode.find("h2>i").eq(1);
            yoyUpDown = yoyNode.hasClass("up") ? "up" : "down";
            //0.53% ↑
            yoy = yoyNode.text().split("%")[0];
        }

        //http://shanghai.anjuke.com/market/lingangxincheng/
        var py = queueItem.url.split("/")[4] || "";
        if (!py) {
            py = queueItem.url.split(".")[0].split("/")[2]
        }
        var letter = py.substr(0, 1).toUpperCase();

        var date = new Date();

        var result = {
            url: queueItem.url,
            name: name,
            area: area,
            district: district,
            city: city,
            year: date.getFullYear(),
            month: date.getMonth() + 1,//getMonth 0~11
            price: price,
            mom: mom,
            momUpDown: momUpDown,
            yoy: yoy,//环比
            yoyUpDown: yoyUpDown,
            py: py,
            letter: letter
        }


        this.times++
        if (this.times > 0) {
            //this.crawler.stop();
            //this.mongoose.disconnect();
        }
        //console.log(regenTarget);
        //console.log(this.times, queueItem.url);
        return result;
    }
}

module.exports = extractor;