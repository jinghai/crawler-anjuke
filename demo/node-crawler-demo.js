/**
 * Created by Administrator on 2016/12/14.
 */
var Crawler = require("crawler");

var crawler = new Crawler({
  maxConnections: 1,
  rateLimit: 5000,
  rotateUA: true,
  userAgent: [
    'Mozilla/5.0 (Windows NT 5.2) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1',
    'Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1'
  ],
  callback: function (error, res, done) {
    if (error) {
      console.error(error);
    } else {
      var $ = res.$;
      $("a[href^='http://shanghai.anjuke.com/sale/p']").each(function(i,url){
        console.log($(url).attr('href'));
      });

      //console.log($('title').text());
    }
    done();
  }
});
var i = 1;
var proxys = [
  'http://172.16.30.1:8888',
  'http://proxy.dc.lan:1234'
];
crawler.on('schedule', function (options) {
  //when a task is being added to scheduler.
  i++;
  //options.proxy = proxys[i % 2];
  console.log('schedule',options.proxy);
  //options.proxy = "http://proxy:port";
});
crawler.on('request', function (options) {
  console.log('ready to request',options.url);
});
crawler.on('drain', function () {
  // 全部完成
  console.log('Complete!');
});

crawler.queue('http://shanghai.anjuke.com/sale/?from=navigation');
