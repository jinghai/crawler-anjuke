# crawler-anjuke
http://mongoosejs.com/docs/index.html
http://www.nodeclass.com/api/mongoose.html#quick_start
https://github.com/winstonjs/winston#using-the-default-logger
https://github.com/bda-research/node-crawler
https://github.com/Automattic/mongoose
https://github.com/winstonjs/winston
https://github.com/kelektiv/node-cron
https://github.com/node-schedule/node-schedule
https://github.com/JacksonTian/eventproxy
https://github.com/cgiffard/node-simplecrawler

https://github.com/mitmproxy/mitmproxy
https://github.com/nodejitsu/node-http-proxy    supports websockets
https://github.com/h2non/toxy                   Full-featured
https://github.com/alibaba/anyproxy
http://anyproxy.io/cn/

https://github.com/haisapan/ProxyScanner.NodeJs
https://github.com/lzrski/node-simplecrawler-queue-mongo
TODO-

v0.1.0
时间戳转时分秒(用时) OK
target需要支持数组（helpUrl）OK

文件队列
crawler.queue.freeze("mysavedqueue.json", function () {
    process.exit();
});
crawler.queue.defrost("mysavedqueue.json");
文件缓存
var cacheFilePath = path.resolve("./");
crawler.cache = new Crawler.cache(cacheFilePath);

v0.3.0
动态变换代理服务器支持

v0.2.0
npm命令行启动
重构

v0.4.0
测试代码
doc生成


每次限制爬取网页数量，达到后停止，间隔指定时间后继续
cache原理与作用
简单的proxyTestServer
完善日志:request数量,traget数量