var ycsv = require('ya-csv');
class Csv {
	constructor() {}
	addrow(file, row, callback) {
		if (typeof callback == 'function') {
			this.addrows(file, [row], callback);
		} else {
			return new Promise(function(resolve, reject) {
				this.addrows(file, [row]).then(resolve).catch(reject);
			}.bind(this))
		}
	}
	addrows(file, rows = [], callback) {
		var self = this;
		return new Promise(function(resolve, reject) {
			self.reader(file).then(function(r) {
				var r = [...rows, ...r];
				return self.writer(file, r);
			}).then(function() {
				if (typeof callback == 'function') {
					callback(null)
				} else {
					resolve()
				}
			}).catch(function(e) {
				if (typeof callback == 'function') {
					callback(e)
				} else {
					reject(e)
				}
			})

		})
	}
	writer(file, rows, callback) {
		return new Promise(function(resolve, reject) {
			var writer = ycsv.createCsvFileWriter(file);
			rows.forEach((r) => writer.writeRecord((r)));

			writer.addListener('close', function(data) {
				console.log("witer finish");
				if (typeof callback == 'function') {
					callback(null, rows);
				} else {
					resolve();
				}

			});
			writer.addListener('error', function(e) {
				if (typeof callback == 'function') {
					callback(e);
				} else {
					reject(e);
				}
			});
		});
	}
	reader(file, callback) {
		return new Promise(function(resolve, reject) {
			var rows = [];
			var reader = ycsv.createCsvFileReader(file);
			reader.addListener('data', function(data) {
				rows.push(data)
			});

			reader.addListener('end', function(data) {
				if (typeof callback == 'function') {
					callback(null, rows);
				} else {
					resolve(rows);
				}

			});

			reader.addListener('error', function(e) {
				if (typeof callback == 'function') {
					callback(e);
				} else {
					reject(e);
				}
			});
		})
	}
}
module.exports = new Csv();
/*
var file = "data/demo0.csv";
var file2 = "data/demoA.csv";
var csv = new Csv();
csv.reader(file).then(function(rows) {
	return csv.writer(file2, rows);
}).then(function() {
	console.log("finish")
})
*/
/*
var csv = new Csv();
var file = "data/demoA.csv";
csv.addrow(file, ["B"]).then(function() {
	console.log(111)
}).catch(function(e) {
	console.log(e)
});
*/

/*
var file = "data/demo.csv";
var file2 = "data/demo2.csv";
var csv = new Csv();
csv.from(file).to(file2).addRow([2, 2, 3, 4])
*/