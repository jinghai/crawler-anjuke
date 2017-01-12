var http = require('http');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var request = require('request');

var get = function(url, options, callback) {
	if (typeof options == 'function') {
		callback = options;
		options = {};
	}
	options = options || {};

	var {
		charset = "UTF8",
			header = {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.1750.117 Safari/537.36'
			}
	} = options;

	return new Promise(function(resolve, reject) {
		let options = {
			url: url,
			encoding: null,
			headers: header
		};
		request(options, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var content = iconv.decode(body, charset);
				resolve(content);
			} else {
				reject(error);
			}
		});
	})
}

var getDOM = function(url, options) {
	return get(url, options).then(function(html) {
		var dom = cheerio.load(html, {
			withDomLvl1: true,
			normalizeWhitespace: true,
			xmlMode: false,
			decodeEntities: false
		});
		return dom;
	})
}

var getJSON = function(url, options) {
	return get(url, options).then(function(content) {
		var json = JSON.parse(content)
		return json;
	})
}

var post = function(url, postBody, options) {
	if (typeof options == 'function') {
		options = {};
	}
	options = options || {};

	var {
		charset = "UTF8",
			header = {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.1750.117 Safari/537.36'
			}
	} = options;

	return new Promise(function(resolve, reject) {
		let options = {
			method: "POST",
			url: url,
			encoding: null,
			headers: header,
			formData: postBody
		};
		request(options, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var content = iconv.decode(body, charset);
				resolve(content);
			} else {
				reject(error);
			}
		});
	})
}


var postJSON = function(url, postBody, options) {
	return post(url, postBody, options).then(function(content) {
		var json = JSON.parse(content)
		return json;
	})
}


var Loader = {
	get: get,
	getJSON: getJSON,
	getDOM: getDOM,
	post: post,
	postJSON: postJSON
}

module.exports = Loader;