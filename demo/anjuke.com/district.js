//来源：安居客
//获取所有地址信息
var loader = require('../../../iRobots/loader.js');
var helper = require('../../../iRobots/helper.js');
var db = require('../../../iRobots/db.js')("10.82.0.1", "house");

//获取区域信息
function district(startURL) {
	return loader.getDOM(startURL).then(function($) {
		var arr = ($($(".elems-l")[0]).find("a"))
		var json = [];
		arr.each((i, a) => {
			var url = $(a).attr("href");
			var name = ($(a).text()).replace(/(^\s*)|(\s*$)/g, "");
			json.push({
				district: name,
				type: "district",
				url: url,
				py: url.replace(startURL, "").replace("/", "")
			})
		})
		return json;
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(item) {
			var district = (item.district);
			var url = (item.url);
			return area(district, url).then(function(arr) {
				return arr;
			});
		})
	}).then(function(arr) {

		var data = arr.reduce(function(previous, current) {
			if (current.length == 0) {
				return previous;
			}
			return previous.concat(current);
		});
		return data;
	}).catch(function(e) {
		console.log(e);
	})
}

//area("园区", "http://suzhou.anjuke.com/community/yuanqu/")

//获取板块最新数据 写入最新数据表
function area(name, url) {
	return loader.getDOM(url).then(function($) {
		console.log(url, "area")
		var arr_a = ($(".sub-items a"));
		var json = [];
		arr_a.each(function(i, item) {


			var district = name;
			var area = ($(item).text()).replace(/(^\s*)|(\s*$)/g, "");
			var url = ($(item).attr("href"));
			var py = url.split("/")[4] || "";
			var letter = "";
			if (py != "") {
				letter = py.substr(0, 1).toUpperCase()
			}


			json.push({
				district,
				area,
				url,
				py,
				//type,
				letter
			})
		})
		return json;
	}).catch(function(e) {

		console.log(name, url)
		console.log(e, "areaError");
		return [];
	})
}

//批量写入数据库
function insertMany(table, arr) {
	console.log(arr.length, "insertSize");
	db.close();
	return db.open(table).then(function(collection) {
		//console.log(collection);
		return collection.insertMany(arr);
	}).then(function() {
		console.log("finish")
		db.close();
	}).catch(function(e) {
		console.log(e, "error")
		db.close();
	})
}

function getAll(startURL, table) {
	return district(startURL).then(function(arr) {
		insertMany(table, arr)
	}).then(function() {
		console.log("district save success");
		return "";
	})
}


module.exports = {
	getAll: getAll,
	area: area
}