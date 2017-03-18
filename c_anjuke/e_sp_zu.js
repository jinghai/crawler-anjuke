/**
 * Created by yneos on 2017/1/1.
 */
var homePage = /^http:\/\/shanghai\.anjuke\.com\/$/,//首页
    listPage = /^http:\/\/sh\.sp\.anjuke\.com\/zu(\/?|\/p\d+\/)$/,//列表页
    targetPage = /^http:\/\/sh\.sp\.anjuke\.com\/zu\/(\d+\/$|\d+\/\?pt=\d+$)/;//目标页
var extractor = {
    name: '安居客_上海_商铺出租',
    //  http://sh.sp.anjuke.com/zu/33858491/
    //target: /^http:\/\/sh\.sp\.anjuke\.com\/zu\/(\d+)\/$/,
    // http://sh.sp.anjuke.com/zu/ http://sh.sp.anjuke.com/zu/p2
    //helpUrl:/^http:\/\/sh\.sp\.anjuke\.com\/zu(\/?|\/p\d+)$/,
    target: [
        homePage,
        listPage,
        targetPage,
    ],
    schema: {
        id: Number,
        title: String,//标题
        city: String,//市
        district: String,//区
        area: String,//板块
        building: String,//楼盘
        floor: String,//楼层
        size: Number,//面积m²
        price: Number,//月租(元)
        type: String,//类型
        industry: String,//推荐行业
        address: String,//地址
        state: String,//状态
        published: Date,//发布时间
        lat: Number,//纬度
        lng: Number,//经度
        lbsType: String,//[baidu]
    },
    //数据唯一标识(字段值连接后md5存放于__k)，若数据已存在不做更新
    keys: ["id"],
    allowUpdate: true,
    //无返回值框架不会保存，可使用new this.model(data)自行操作
    handler: function ($, queueItem, responseBuffer, response) {
        var url = queueItem.url;
        if (homePage.test(url)) {
            //console.log('homePage');
            return null;
        }

        if (listPage.test(url)) {
            return this.listPage($, queueItem);
        }

        if (targetPage.test(url)) {
            return this.targetPage($, queueItem);
        }

        return null;
    },
    listPage: function ($, queueItem) {
        //console.log('listPage',queueItem.url);
        var self = this;
        $('div.list-item').each(function () {
            var u = $(this).attr('link');
            if (u) {
                //console.log('queueURL', u, 'from', queueItem.url);
                self.crawler.queueURL(u, queueItem, false);
            }
        });
        return null;
    },
    targetPage: function ($, queueItem) {
        //http://sh.sp.anjuke.com/zu/33922059/
        var id, title, city, district, area, building, floor, size, price, type, industry, address, state, published,
            lat, lng, lbsType;
        var tmp = queueItem.url.split('/');
        id = tmp[tmp.length - 2];

        var html = $.html();
        tmp = html.split('lat:')[1];
        tmp = tmp.split(',')[0];
        tmp = tmp.replace(/\s/g, '').replace(/\"/g, '');
        lat = tmp;

        tmp = html.split('lng:')[1];
        tmp = tmp.split(',')[0];
        tmp = tmp.split('\/')[0];
        tmp = tmp.replace(/\s/g, '').replace(/\"/g, '');
        lng = tmp;

        //上海房产网 > 上海商铺出租 > 松江商铺出租 > 九亭商铺出租 > 恒耀广场
        tmp = $('div.p_1180.p_crumbs').text().replace(/\s/g, '').trim().split(">");
        tmp.shift();
        city = tmp[0].replace('商铺出租', '').trim();
        district = tmp[1].replace('商铺出租', '').trim();
        area = tmp[2].replace('商铺出租', '').trim();

        title = $('h1.tit-name').text();

        var infos = $('#fy_info>ul>li>span.desc');
        price = $('div.tit-sub>span.price-tag>em').text();
        price = parseFloat(price)*10000;
        size = $(infos[1]).text().replace("m²", "").trim();
        type = $(infos[2]).text().trim();
        building = $(infos[3]).text().replace(/\s/g, '').trim();
        address = $(infos[4]).text().replace(/\s/g, '').trim();
        state = $(infos[8]).text().trim();
        floor = $(infos[9]).text().trim();
        industry = $(infos[13]).text().trim();

        address = address.replace(district, '').replace(area, '');
        tmp = area==building?area:area+" "+building;
        address = city + " " + district + " " + tmp + " " + address;

        tmp = $('#xzl_desc>h3.hd>div.hd-sub').text().replace(/\s/g,'').split('发布时间');
        tmp = tmp[1].split('房源编号');
        published = tmp[0];

        var obj = {
            id: id,
            title: title,
            city: city,
            district: district,
            area: area,
            building: building,
            floor: floor,
            size: size,
            price: price,
            type: type,
            industry: industry,
            address: address,
            state: state,
            published: published,
            lat: lat,
            lng: lng,
            lbsType: 'baidu',
        }
        //console.log(obj);
        //this.crawler.stop();
        return obj;
    },
}

module.exports = extractor;