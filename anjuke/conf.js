/**
 * Created by yneos on 2017/1/1.
 */
var conf = {
    startPage:"http://shanghai.anjuke.com/",
    domain:shanghai.anjuke.com,
    extractors:[{
        //匹配区域网址 http[s]://shanghai.anjuke.com/market[/]...
        targetReg:/^http(s?):\/\/shanghai\.anjuke\.com\/market(\/?)/i,
        extractor:function($,url){
            if(this.targetReg.test(url)){
                //do...
            }
        }
    }]
}
module.exports = conf;