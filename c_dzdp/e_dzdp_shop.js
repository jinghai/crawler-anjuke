/**
 * Created by yneos on 2017/1/1.
 * 大众点评_商户
 *
 */

var extractor = {
    name: '大众点评_商户',
    target: /^http:\/\/www\.dianping\.com\/search\/category\/(\d+)\/(\d+)\/(p?)/g,
    schema: {
        id: Number,//大众点评id
        name: String,//商户名称
        address: String,//文字地址
        city:String,

        channel: String,// 一级分类【逗号表达式】行业/频道（channel）
        channelCode: String,
        type: String,//二级分类【逗号表达式】行业细分（type）
        typeCode: String,
        branch: String, //三级分类【逗号表达式】品牌（branch）
        branchCode: String,

        bussiArea: String,//商区
        bussiAreaCode: String,
        subBussArea: String,//子商区/地标
        subBussAreaCode: String,

        district: String,//行政区
        districtCode: String,
        subDistrict: String,//子行政区
        subDistrictCode: String,

        subwayLine: String,//地铁线
        subwayLineCode: String,
        subwayStation: String,//地铁站
        subwayStationCode: String,
    },
    keys: ['id'],
    times: 0,
    //强制更新，运行过程中可动态改变
    allowUpdate: true,
    //指定需要合并更新的字段，字段类型必需为String，新数据与数据库老数据不同则合并，合并后使用“｜”分割
    mergeUpdate:['channel','channelCode','type','typeCode'],
    //返回一个数据对象或数组
    handler: function ($, queueItem, responseBuffer, response) {





        console.log(this.hasType($));
        this.times++
        if (this.times > 0) {
            this.crawler.stop();
            //this.mongoose.disconnect();
        }
        return null;
    },
    //是否选中了频道/行类
    hasChannel:function($){
        var el  = $('div.navigation>div.nav-category>h4');
        if(el && (el.text().indexOf('分类:')>-1)){
            return true;
        }else{
            return false;
        }
    },
    //是否选中了子分类
    hasType:function($){

    },
    //是否选中了品牌
    hasBranch:function($){

    },
    //是否选中了商区
    hasBranch:function($){

    },
    //是否选中了子商区
    hasBranch:function($){

    },
    //是否选中了行政区
    hasBranch:function($){

    },
    //是否选中了子行政区
    hasBranch:function($){

    },
    //是否选中了地铁线
    hasBranch:function($){

    },
    //是否选中了地铁站
    hasBranch:function($){

    },
}

module.exports = extractor;