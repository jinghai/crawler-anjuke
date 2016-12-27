var map = require("../../../iRobots/baidu.js")
var loader = require('../../../iRobots/loader.js');
var helper = require('../../../iRobots/helper.js');
var db = require('../../../iRobots/db.js')("10.82.0.1", "house");

export var loadSpace = function(geoURL, name) {
	return loader.postJSON(geoURL, {
		kw: name
	}).then(function(json) {
		return (json)
	}).catch(function(e) {
		console.log(e, "error");
	})
}

function getAnJukePoint(info) {
	return {
		lat: info.lat,
		lng: info.lng
	}
}

function getAnJukePrice(info) {
	var upDown = "up";
	var fc = parseFloat(info.midChange)
	if (fc < 0) {
		upDown = "down"
		fc = -fc;
	}
	var compare = (fc * 100).toFixed(2);
	var price = info.midPrice;
	return {
		compare,
		upDown,
		price
	}
}


export var loadPoint = function(table, geoURL) {
	db.close();
	db.open(table).then(function() {
		return db.collection.find({
			point: null
		}, {
			name: 1
		}).toArray()
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(it) {
			var search = it.name;
			return loadSpace(geoURL, search).then(function(data) {
				if (data.matchType > 0) {
					var info = data.info[0];
					// var {
					// 	compare,
					// 	upDown,
					// 	price
					// } = getAnJukePrice(info)
					var point = getAnJukePoint(info);
					//var commId = info.commId;
					var _id = it._id
					return {
						//compare,
						//upDown,
						//price,
						point,
						//commId,
						_id
					}

				}

				return it;
			}).then(function(data) {
				console.log(data)
				return db.collection.update({
					_id: db.ObjectId(data._id)
				}, {
					$set: {
						//compare: data.compare,
						//price: data.price,
						//commId: data.id,
						//upDown: data.upDown,
						point: data.point
					}
				}).then(function() {
					console.log(search, "point success")
					return data;
				}).catch(function(e) {
					console.log(search, "point error")
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



export var loadBDPoint = function(table, city) {
	db.close();
	db.open(table).then(function() {
		return db.collection.find({
			bdMapMatch: null
		}, {
			name: 1,
			point: 1
		}).toArray()
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(it) {
			var name = it.name;
			var _id = it._id;
			var point = it.point;
			var bdMapMatch = 0;

			return loadGeocoderAPI(name, city).then(function(data) {
				if (data == null) {
					return {
						_id,
						bdMapMatch,
						point
					};
				}
				bdMapMatch = 1;
				point = data.location
				return {
					_id,
					point,
					bdMapMatch
				};
			}).then(function(data) {
				console.log(data)
				return db.collection.update({
					_id: db.ObjectId(data._id)
				}, {
					$set: {
						point: data.point,
						bdMapMatch: data.bdMapMatch
					}
				}).then(function() {
					console.log(name, "point success")
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


function loadGeocoderAPI(name, city) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			map.loadGeocoderAPI(name, city).then(function(data) {
				if (data.status == 0 && 　data.result.level == "地产小区") {
					resolve(data.result);
				} else {
					resolve(null);
				}
			}).catch(reject)
		}, 10)
	})
}


export var loadBDPlacePoint = function(table, city) {
	db.close();
	db.open(table).then(function() {
		return db.collection.find({
			point: null
		}, {
			name: 1
		}).toArray()
	}).then(function(arr) {
		return helper.iteratorArr(arr, function(it) {
			var search = it.name;
			return map.loadPlaceAPI(search, city).then(function(data) {
				if (data.results.length > 0) {
					it.point = data.results[0].location;
					return it;
				}
				return null;
			}).then(function(data) {
				if (data == null) {
					return null
				};
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