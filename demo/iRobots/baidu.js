var loader = require('./loader.js');

function loadPlaceAPI(name, city, page_num = 0) {
	function getPlaceUrl(name, city) {
		return `http://api.map.baidu.com/place/v2/search?q=${name}&region=${city}&&page_size=20&page_num=${page_num}&output=json&ak=8hr2ZB5zsFI6dcId9Uj6ORy2kuLIP8vA`
	}
	var url = encodeURI(getPlaceUrl(name, city));
	return loader.getJSON((url)).then(function(data) {
		return data;
	}).catch(function(e) {
		console.log(e);
	})
}

function loadGeocoderAPI(name, city) {
	function getUrl(name, city) {
		return `http://api.map.baidu.com/geocoder/v2/?output=json&address=${name}&city=${city}&ak=8hr2ZB5zsFI6dcId9Uj6ORy2kuLIP8vA`
	}

	var url = encodeURI(getUrl(name, city));
	return loader.getJSON((url)).then(function(data) {
		return data;
	}).catch(function(e) {
		console.log(e);
	})
}

function loadGeocoderGPSAPI(points) {
	function getUrl(points) {
		//return `http://api.map.baidu.com/geocoder/v2/?output=json&address=${name}&city=${city}&ak=8hr2ZB5zsFI6dcId9Uj6ORy2kuLIP8vA`
		var str = points[1] + "," + points[0];
		return `http://api.map.baidu.com/geocoder/v2/?location=${str}&output=json&pois=2&ak=8hr2ZB5zsFI6dcId9Uj6ORy2kuLIP8vA`
	}

	var url = encodeURI(getUrl(points));
	return loader.getJSON((url)).then(function(data) {
		return data;
	}).catch(function(e) {
		console.log(e);
	})
}

module.exports = {
	loadPlaceAPI: loadPlaceAPI,
	loadGeocoderAPI: loadGeocoderAPI,
	loadGeocoderGPSAPI: loadGeocoderGPSAPI
};