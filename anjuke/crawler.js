/**
 * Created by yneos on 2017/1/1.
 */
var Crawler = require("simplecrawler");
var cheerio = require('cheerio');



var initialURL = "http://shanghai.anjuke.com/";
var crawler = Crawler(initialURL);


//匹配区域网址 http[s]://shanghai.anjuke.com/market[/]...
var regenTargetReg = /^http(s?):\/\/shanghai\.anjuke\.com\/market(\/?)/i;
var staticResourcesReg = /\.(png|jpg|jpeg|gif|ico|css|js|csv|doc|docx|pdf)+/i;
var conditionID = crawler.addFetchCondition(function (queueItem, stateData) {//发现以后决定是否放入加载队列
    //console.log("FetchCondition:",queueItem.url,!staticResourcesReg.test(queueItem.url));
    return /*!staticResourcesReg.test(queueItem.url) &&*/ regenTargetReg.test(queueItem.url);
});


//crawler.discoverResources = [];
//crawler.discoverRegex = [];
crawler.maxConcurrency = 1;
crawler.interval = 3000;
crawler.decodeResponses = true;
crawler.respectRobotsTxt = false;
crawler.filterByDomain = true;
crawler.scanSubdomains = true;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 5.2) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30';
crawler.acceptCookies = false;

//不自动发现,只加载初始化url（自定义发现规则）
/*crawler.discoverResources = function(buffer, queueItem) {
    /!*$ = cheerio.load(buffer.toString("utf8"));

    return $("a[href]").map(function () {
        return $(this).attr("href");
    }).get();*!/
};*/


crawler.on("crawlstart", function () {
    //console.log("crawlstart");
});
crawler.on("queueadd", function (queueItem) {
    //console.log("queueadd",queueItem.url);
});
//discover
crawler.on("discoverycomplete", function (queueItem, resources) {
    //console.log("discoverycomplete", queueItem, resources);
    //console.log("discoverycomplete", queueItem.url, resources);
});
crawler.on("fetchstart", function (queueItem, requestOptions) {
    //console.log("fetchstart",requestOptions)
    //console.log("fetchstart", queueItem.url, Date());
    //console.log("fetchstart", queueItem, requestOptions);
});
crawler.on("fetchheaders", function (queueItem, responseObject) {
    //console.log("fetchheaders", queueItem.url, Date());
    //console.log("fetchheaders", queueItem, responseObject);
});
crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
    console.log("fetchcomplete", queueItem.url, Date());
    var next = this.wait();
    if (regenTargetReg.test(queueItem.url)) {
        $ = cheerio.load(responseBuffer);
        //上海房产网 > 上海房价 > 徐汇房价 > 徐家汇房价
        var regionRelation = $(".crumb").text().replace(/房价/g, '').replace(/\s/g, '').split(">");
        regionRelation.shift();

        var regionName = regionRelation[regionRelation.length - 1];

        var priceNode = $("div.trendR");
        var regionPrice = priceNode.find("h2.highLight>em").eq(0).text();

        //环比month-on-month
        var momNode = priceNode.find("h2>i").eq(0);
        var momType = momNode.hasClass("up") ? "up" : "down";
        //0.53% ↑
        var mom = momNode.text().split("%")[0];
        //同比year-on-year
        var yoyNode = priceNode.find("h2>i").eq(1);
        var yoyType = yoyNode.hasClass("up") ? "up" : "down";
        //0.53% ↑
        var yoy = yoyNode.text().split("%")[0];
        var regenTarget = {
            url:queueItem.url,
            regionName: regionName,
            regionPrice: regionPrice,
            regionRelation: regionRelation,
            mom: mom,
            momType: momType,
            yoy: yoy,
            yoyType: yoyType
        }

        console.log(regenTarget);
        //crawler.stop();
    }
    next();

    // console.log("fetchcomplete", responseBuffer, response);
});
crawler.on("fetchtimeout", function (queueItem, crawlerTimeoutValue) {
    //console.log("fetchtimeout", queueItem, crawlerTimeoutValue);
});
crawler.on("fetcherror", function (queueItem, responseObject) {
    //console.log("fetcherror", queueItem, responseObject);
});
crawler.on("queueadd", function (queueItem) {
    //console.log("queueadd", queueItem.url);
});

crawler.on("complete", function () {
    console.log("complete");
});
crawler.start();
