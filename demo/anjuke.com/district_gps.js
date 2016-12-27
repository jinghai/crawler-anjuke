var map = require("../../../iRobots/baidu.js")
var loader = require('../../../iRobots/loader.js');
var helper = require('../../../iRobots/helper.js');
var db = require('../../../iRobots/db.js')("10.82.0.1", "house");

export var loadDistrictPoint = function(table, geoURL) {
	db.close();
	db.open(table).then(function() {
		return db.collection.find({
			point: null
		}, {
			area: 1,
			district: 1
		}).toArray()
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(it) {
			var search = it.area;
			if (search == "全部") {
				search = it.district;
			}
			return loadSpace(geoURL, search).then(function(data) {
				if (data.lat) {
					it.point = {
						lat: parseFloat(data.lat),
						lng: parseFloat(data.lng)
					}
				}
				return it;
			}).then(function(data) {
				return db.collection.update({
					_id: db.ObjectId(data._id)
				}, {
					$set: {
						point: data.point
					}
				}).then(function() {
					console.log(search, "point success")
					return data;
				}).catch(function(e) {
					db.close();
					console.log(e);
					return
				})
			})
		})
	}).then(function() {
		db.close();
		console.log("success");
	})

}

export var loadDistrictBDPoint = function(table, city) {
	db.close();
	db.open(table).then(function() {
		return db.collection.find({
			point: null
		}, {
			area: 1,
			district: 1
		}).toArray()
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(it) {
			var search = it.area;
			if (search == "全部") {
				search = it.district;
			}
			return map.loadPlaceAPI(search, city).then(function(data) {
				//console.log(data)
				it.point = data.results[0].location;
				return it;
			}).then(function(data) {
				return db.collection.update({
					_id: db.ObjectId(data._id)
				}, {
					$set: {
						point: data.point
					}
				}).then(function() {
					console.log(search, "point success")
					return data;
				})
			})

		})
	}).then(function(arr) {
		//console.log(arr);
		db.close();
		console.log("Address Point finish");
	}).catch(function(e) {
		db.close();
		console.log(e);
	})
}


// district: '园区',
// 	point: {
// 		lng: 120.71463459445,
// 		lat: 31.328803977968
// 	}
// loadSpace("姑苏区")

export var loadSpace = function(geoURL, name) {

	return loader.postJSON(geoURL, {
		kw: name
	}).then(function(json) {
		console.log(json);
		return (json)
	}).catch(function(e) {
		console.log(e, "error");
	})
}


function _old() {
	//通过地图方式获取
	var url = "http://suzhou.anjuke.com/map/sale/";
	loader.getDOM(url).then(function($) {
		var json = [];
		$("#area_link_list a").each((i, a) => {
			var a = $(a);
			var district = a.text();
			if (district != "不限") {

				var point = {
					lng: parseFloat(a.attr("lng")),
					lat: parseFloat(a.attr("lat"))
				}
				if (a.attr("lng") == "") {
					point = null;
				}
				json.push({
					district,
					point
				});
			}
		});
		return json;
	}).then(function(arr) {
		console.log(arr);
	})
}