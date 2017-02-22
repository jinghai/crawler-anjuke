/**
 * Created by yneos on 2017/1/1.
 * 大众点评_商户
 *
 */

var extractor = {
    name: '大众点评_商户',
    target: /^http:\/\/www\.dianping\.com\/search\/category\/(\d+)\/(\d+)\/(p?)/g,
    schema: {
        name: String,//商户名称
        id: Number,//大众点评id
        adress: String,//文字地址

        channel: String,// 一级分类【逗号表达式】
        channelCode: String,
        type: String,//二级分类【逗号表达式】
        typeCode: String,
        branch: String, //三级分类【逗号表达式】
        branchCode: String,

        bussiArea: String,//商区
        bussiAreaCode: String,
        subBussArea: String,//子商区
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
    hasSubType:function($){

    },
    //是否选中了品牌
    //是否选中了商区
    //是否选中了子商区
    //是否选中了行政区
    //是否选中了子行政区
    //是否选中了地铁线
    //是否选中了地铁站
}

module.exports = extractor;