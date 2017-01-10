/**
 * Created by yneos on 2017/1/10.
 */
var _ = require('lodash');
var Crawler = require("simplecrawler");
var path = require("path");
var cheerio = require('cheerio');

var myUtil = {
    staticResourcesReg : /\.(png|jpg|jpeg|gif|ico|css|js|csv|doc|docx|pdf)+/i,
    defaultCrawlerConfig:{
        maxConcurrency:1,
        interval:1000,
        decodeResponses:true,
        respectRobotsTxt:false,
        filterByDomain:true,
        scanSubdomains:true,
        userAgent:'Mozilla/5.0 (Windows NT 5.2) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30',
        acceptCookies:false
    },
    createCrawler:function(config){
       // var conf =  _.extend({},this.defaultCrawlerConfig,config);
        var crawler = Crawler(config.crawler.initialURL);
        _.extend(crawler,this.defaultCrawlerConfig,config.crawler);

        /*路径测试
        console.log(path.resolve("."))
        console.log(__dirname);
        console.log(__filename);
        console.log(process.cwd());
        console.log(path.resolve('./'));*/

        var extractorList = [];
        _.forEach(config.extractors,function(extrator,index){
            var extor = {
                target:extrator.target,
                handle:require(path.resolve(extrator.handler))
            }
            extractorList.push(extor)
        });

        crawler.addFetchCondition(function (queueItem, stateData) {//发现以后决定是否放入加载队列
            for(var index in extractorList){
                if(extractorList[index].target.test(queueItem.url)){
                    return true;
                }
            }
            return false;
        });

        crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
            var $ = null;
            for(var index in extractorList){
                if(extractorList[index].target.test(queueItem.url)){
                    if(!$){
                        $ = cheerio.load(responseBuffer);
                    }
                    extractorList[index].handle.handler($,queueItem,responseBuffer, response);
                }
            }
        });

        crawler.on("queueadd", function (queueItem) {
            console.log("queueadd",queueItem.url);
        });


        return crawler;
    }
}
module.exports = myUtil;

