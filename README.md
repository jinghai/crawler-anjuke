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

https://github.com/Unitech/pm2
https://github.com/jdarling/MongoMQ

-TODO-

--动态代理服务器

--发布为npm包 ??

--数据插入后的事件通知 ??

--限制爬取网页数量，达到后停止，间隔指定时间后继续

--持续集成

--文件队列
crawler.queue.freeze("mysavedqueue.json", function () {
    process.exit();
});
crawler.queue.defrost("mysavedqueue.json");
--文件缓存
var cacheFilePath = path.resolve("./");
crawler.cache = new Crawler.cache(cacheFilePath);


--更新2017.2.13--
1.爬虫目录名称和爬虫启动文件名称的规约

1).爬虫目录以"c_"开头

2).爬虫的启动文件名与爬虫目录同名

3).数据抽取器以"e_"开头

2.启动方式改为pm2启动

3.增加多个target支持（参见c_proxy/e_xicidaili.js）

4.数据抽取器支持返回一个数组，以支持一次提取多条数据（参见c_proxy/e_xicidaili.js）

5.增加自定义target函数（参见c_xingZhengQu/e_index.js）

6.logLevel为debug则不生成日志文件，只在控制台打印

7.数据库增加了__url,__created 字段

8.支持keys为空，当keys为空时，框架以__url字段为key.即只以url做为重复数据的判断条件

http://mongoosejs.com/docs/api.html#schema_Schema.reserved
schema关键字：以下不能做为schema的字段
on, emit, _events, db, get, set, init, isNew, errors, schema, options, modelName, collection, _pres, _posts, toObject

--更新2017.2.22--
1.extractor 增加allowUpdate属性[是否允许更新，默认为false],控制是否更新数据。使用方式参见“e_dzdp_shop.js”
2.增加___updated内置字段
3.修复__url内置字段没有保存到数据的的bug
4.修复log序号打印问题

--更新2017.2.23--
修复定时任务不起作用问题

todo
no extractor增加mergeFields，指定更新时需要合并的字段，字段类型必需为String，新数据与数据库老数据不同则合并，合并后使用“｜”分割 allowUpdate为true时生效

已知问题:
1.schema关键字：以下不能做为schema的字段
on, emit, _events, db, get, set, init, isNew, errors, schema, options, modelName, collection, _pres, _posts, toObject

架构：
  重构
    1.ConfigLoader 配置项检测，抽取器解析 loadConfig(path)
    2.Task->CrawlerTask  创建配置爬虫,定时任务 start stop
    3.Dao->MongodbDao   save update 单个与批量
    4.CrawlerAdapter 多爬虫适配
HttpClinet独立
分布式队列

自动测试：
测试步骤：
1.指定target和help，测试请求url路径是否达到预期
2.调整请求频率，测试目标网站的限速情况
3.通过指定不同的入口地址，测试每个提取结果是否达到预期，一次访问即可complete.不保存数据库
  可能要对每个提取器，选择出多个正常和极端情况的url来测试不同情况，这些url的选择决定测试质量
4.与上面测试相同，但要保存数据库，并重复执行二次，考查更新的情况


可用性:
允许handler异步调用
1.npm包
2.pm2集成
3.cli 参考MongoMQ
4.rest api
爬虫代码打包上传
平台上直接编辑，测试，启停，监控

功能：
1.js代码生成网页
2.需要登陆验证后才能访问的网页

性能：
1.动态代理服务器
2.分布式集群

安居客 每月爬取3次 每次爬行需要3天时间 10秒一次
行政区 每年爬取3次 每次爬行需要1天时间 2秒一次