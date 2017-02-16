var map = require("../../iRobots/baidu.js")
var loader = require('../../iRobots/loader.js');
var helper = require('../../iRobots/helper.js');
var db = require('../../iRobots/db.js')("10.82.0.1", "subway");

var table = "shanghai_station";

var line = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16];

//subway(line)

function subway(arr) {
	return helper.iteratorArr(arr, function(it) {
		return loadSubway(it);
	}).then(function(data) {
		var flatten = data.reduce(function(previous, current) {
			return previous.concat(current);
		});
		return flatten;
	}).then(function(data) {
		return db.open(table).then(function() {
			return db.collection.insertMany(data);
		})
	}).then(function() {
		db.close()
		console.log("success");
	}).catch(function(e) {
		db.close()
		console.log(e);
	})
}


function loadSubway(id) {
	var url = `http://service.shmetro.com/i/fa?metoh=getLineList&line=${id}`;
	return loader.postJSON(url).then(function(json) {
		return json;
	})

}