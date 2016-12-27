//获取所有地址信息
var loader = require('../../../iRobots/loader.js');
var helper = require('../../../iRobots/helper.js');
var db = require('../../../iRobots/db.js')("10.82.0.1", "house");
//var url = "http://shanghai.anjuke.com/sale/biyun/";
export var updatePrice = function(table, city) {
	db.open(table).then(function() {
		return db.collection.findOne({
			price: null
		}, {
			py: 1,
			area: 1,
			district: 1,
			_id: 0
		})
	}).then(function(item) {
		if (item == null) {
			//console.log("finish");
			return null;
		}
		console.log(item)
		return getPrice(getURL(city, item.py)).then(function(data) {
			return db.collection.update(item, {
				$set: data
			})
		})
	}).then(function(data) {
		if (data == null) {
			console.log("finish");
			return
		}
		updatePrice(table, city);
	}).catch(function(e) {
		db.close()
		console.log(e)
	})

}

//updatePrice()

// getPrice(url).then(function(data) {
// 	console.log(data);
// })
// 
function getURL(city, py) {
	return `http://${city}.anjuke.com/sale/${py}/"`;
}

function getPrice(url) {
	return loader.getDOM(url).then(function($) {
		var $house_price = $(".house-price");
		var $price = $house_price.find(".price-num em");
		var $compare = $house_price.find(".compare-price dd");
		var $month = $house_price.find(".month-price dt");

		var price = $price.text().replace("m²", "");
		var compare = $compare.find("em").text();
		var upDown = $compare.attr("class");
		var month = $month.text().replace(/[^0-9]/ig, "");
		var json = {
			price,
			compare,
			upDown,
			month
		};
		return json;
	}).catch(function(e) {
		console.log(e)
	})
}


//显示苏州行政区域价格
//test()

function test() {
	db.open("suzhou_anjuke_area").then(function() {
		return db.collection.find({
			area: "全部"

		}, {
			district: 1,
			area: 1,
			price: 1,
			point: 1,
			upDown: 1,
			compare: 1,
			_id: 0
		}).toArray();
	}).then(function(arr) {
		db.close();
		console.log(JSON.stringify(arr))
	})
}