/**
 * Created by yneos on 2017/1/1.
 */
var conf = {
    crawler:{
        initialURL:"http://shanghai.anjuke.com/"
    },

    extractors:[{
        //匹配区域网址 http[s]://shanghai.anjuke.com/market[/]...
        target:/^http(s?):\/\/shanghai\.anjuke\.com\/market(\/?)/i,
        handler:"./area_extract.js"
    }]


}
module.exports = conf;