//获取所有地址信息
var district = require('../district.js');
var district_gps = require('../district_gps.js');
var district_price = require('../district_price.js');
var startURL = "http://shanghai.anjuke.com/community/";
var geoURL = "http://shanghai.anjuke.com/ajax/geomap/";
var table = "shanghai_anjuke_area";

//1.抓取所有地区信息 (初始化)
//district.getAll(startURL, table);
//错误重新抓
// district.area("杨浦", "http://shanghai.anjuke.com/community/yangpu/");
// district.area("崇明", "http://shanghai.anjuke.com/community/chongming/");

//2.1转换区域点的坐标 (初始化)
//district_gps.loadDistrictPoint(table, geoURL);

//2.2如果没有找到用百度地图再转换一次 (初始化)
//district_gps.loadDistrictBDPoint(table, "上海市");

//2.3手动处理无坐标或者坐标偏差数据
//TODO

//3.获取行政区域地理边界数据(初始化)
//TODO

//4.1更新区域平均价格
//district_price.updatePrice(table, "shanghai");

//4.2平均价格动态定时运行 (容错机制)
//TODO 

//4.3记录每月的价格
//TODO