/**
 * Created by yneos on 2017/1/1.
 */
var conf = {
    crawler:{
        initialURL:"http://shanghai.anjuke.com/"
    },

    db:{
        connStr:"mongodb://192.168.2.67/test",
        debug:true
    },

    extractors:[{
        handler:"./area_extract.js",
        schema:{}
    }]


}
module.exports = conf;