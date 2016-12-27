var map = require("../../../iRobots/baidu.js")
var loader = require('../../../iRobots/loader.js');
var helper = require('../../../iRobots/helper.js');
var db = require('../../../iRobots/db.js')("10.82.0.1", "house");



// var startURL = "http://suzhou.anjuke.com/community/dongshanc/"
// loadPage(startURL, "东山", "吴中")


export var loadAll = function(openTable, saveTable) {
	db.open(openTable).then(function() {
		return db.collection.find({
			area: {
				$ne: "全部"
			}
		}, {
			area: 1,
			district: 1,
			url: 1
		}).toArray()
	}).then(function(data) {
		db.close();
		return data;
	}).then(function(data) {
		return helper.iteratorArr(data, function(it) {
			return loadPage(saveTable, it.url, it.area, it.district);
		})
	}).then(function(data) {
		db.close();
		console.log("finish", "loadAll")
	})
};



function loadPage(table, url, area, district) {
	return loadOnePage(table, url, area, district).then(function() {
		console.log(url, "finish");
		return null;
	})

}


//通过递页数去获取小区 (方法不保险)
function loadOnePage(table, url, area, district, page = 1) {
	let startURL = `${url}o6-p${page}/`;
	//console.log(startURL, "start");
	//startURL = "http://suzhou.anjuke.com/community/p2/";
	return loader.getDOM(startURL).then(function($) {
		var arr = $(".li-itemmod");
		var json = [];
		if (arr.length > 0) {
			arr.each((i, it) => {
				var $div = $(it);
				var $a2 = $div.find('.bot-tag [rel="nofollow"]');
				var url = $a2.attr("href").replace("/map/sale/#", "");
				var urlArr = url.split("&");

				var lat = parseFloat(urlArr[0].replace("l1=", "").replace(/(^\s*)|(\s*$)/g, ""));
				var lng = parseFloat(urlArr[1].replace("l2=", "").replace(/(^\s*)|(\s*$)/g, ""));
				var name = urlArr[4].replace("commname=", "").replace(/(^\s*)|(\s*$)/g, "");
				var anjukeId = urlArr[5].replace("commid=", "").replace(/(^\s*)|(\s*$)/g, "");


				var price = parseFloat($div.find(".li-side strong").text()) || 0;
				var $priceTxt = ($div.find(".li-side .price-txt").text());
				var upDown = "down";
				if ($priceTxt.indexOf("&uarr;") > 0) {
					upDown = "up"
				}

				var compare = parseFloat($priceTxt.replace(/[^0-9.]/ig, "")) || 0;

				var point = {
					lat,
					lng
				};
				json.push({
					name,
					anjukeId,
					point,
					area,
					price,
					upDown,
					compare,
					district
				});
			})
			return json;
		}
		if ($(".msg").text().indexOf("抱歉！没有找到符合要求的小区") > -1) {
			console.log(startURL, "community finish");
			return null;
		}
		return null;
	}).then(function(data) {
		if (data == null) {
			return null;
		};
		return db.open(table).then(function() {
			return db.collection.insertMany(data).then(function(data) {
				//console.log(data.result);
				return data;
			})
		}).then(function(data) {
			return loadOnePage(table, url, area, district, ++page);
		})
	}).catch(function(e) {
		console.log(startURL, "error");
		return loadOnePage(table, url, area, district, page);
		//console.log(e);
	})

}

//fixname

export var fixName = function(table) {
	db.close();
	db.open(table).then(function() {
		return db.collection.find({
			name: /\(/i
		}).toArray()
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(it) {
			var _id = it._id;
			var _name = it.name;
			var name = it.name.split("(")[0].replace(/(^\s*)|(\s*$)/g, "");
			return db.collection.update({
				_id: db.ObjectId(_id)
			}, {
				$set: {
					_name: _name,
					//price: data.price,
					//commId: data.id,
					//upDown: data.upDown,
					name: name
				}
			})
		})
	}).then(function() {
		db.close();
	})
}