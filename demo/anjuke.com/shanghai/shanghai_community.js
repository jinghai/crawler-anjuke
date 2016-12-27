var community_gps = require('../community_gps.js');
var community = require('../community.js');
var geoURL = "http://shanghai.anjuke.com/ajax/geomap/";
var table = "shanghai_anjuke_community";

//1.抓取所有小区对应抓取的地址信息，如果有小区信息同时抓取 (初始化)
var tableOpen = "shanghai_anjuke_area";
var table = "shanghai_anjuke_community";
community.loadAll(tableOpen, table);

//2.1获取小区地理信息 (初始化)
//community_gps.loadPoint(table, geoURL);

//2.2如果没有找到用百度地图再转换一次 (初始化)
//district_gps.loadDistrictBDPoint(table, "苏州市");


//2.3手动处理无坐标或者坐标偏差数据(初始化)
//TODO

//2.4获取小区区域地理边界数据(初始化)
//TODO


//3. 检查新小区并更新小区信息
//TODO

//4.1更新区域平均价格
//TODO


//4.2平均价格动态定时运行 (容错机制)
//TODO 

//4.3记录每月的价格
//TODO