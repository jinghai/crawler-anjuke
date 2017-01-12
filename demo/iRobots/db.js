var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
//var url = 'mongodb://127.0.0.1:27017/';
class DB {
	constructor(url = "127.0.0.1", dbName = "test") {
		this.url = `mongodb://${url}:27017/${dbName}`;
		this.db = null;
		this.collection = null;
		this.ObjectId = mongodb.ObjectId;
	}
	open(table) {
		return new Promise((resolve, reject) => {
			if (this.db && this.db != null) {

				resolve(this.collection);
				return;
			}
			MongoClient.connect(this.url).then((db) => {
				console.log("openDB")
				this.db = db;
				var collection = this.collection = db.collection(table);
				resolve(this.collection);
			}).catch(reject);
		})

	}

	close() {
		this.db && this.db.close();
		this.db = null;
		this.collection = null;
	}

	insert(rows) {
		if (!Array.isArray(rows)) {
			rows = [rows]
		}
		rows.map((i) => {
			i["_id"] = (new mongodb.ObjectId().toString())
		});
		return new Promise((resolve, reject) => {
			this.collection.insert(rows, {
				w: 1
			}).then(resolve).catch(reject);
		})
	}


	insertUnique(rows, key) {

		return new Promise((resolve, reject) => {
			if (!Array.isArray(rows)) {
				rows = [rows]
			}

			var it = rows[Symbol.iterator]();
			var i = ((item) => {

				if (item.done) {
					resolve()
					return;
				}

				let row = item.value;

				var seachKey = row;
				if (key) {
					var obj = {};
					obj[key] = row[key]
					seachKey = obj;
				}
				//console.log(row)
				this.collection.find(seachKey).toArray().then((t) => {
					//console.log(t.length > 0)
					if (t.length == 0) {
						return this.insert(row);
					} else {
						console.log(row.url, "is not Unique");
						return row
					}
				}).then(function() {
					i(it.next());
				}).catch(reject);

			})
			i(it.next())

		})
	}



}

module.exports = function(url, dbName) {
	return new DB(url, dbName);
}

/*
var rows = [{
	url: "AAAB"
}, {
	url: "AAAC"
}]

var db = new DB;
var o = {
	w: 1
};
o.multi = true

db.open("url").then(function() {
	return db.insert(rows);
}).then(function() {
	db.close();
}).catch(function(e) {
	console.log(e);
	db.close();
})
*/
/*
db.open("url").then(function(collection) {
	collection.find({}).sort({
		_id: 1
	})

})
*/
// var db = new DB;
// db.open("articles").then(function(collection) {
// 	return collection.findOne({})

// }).then(function(json) {

// 	console.log(json.createDate)
// 	console.log(new Date(json.createDate).toLocaleString())
// 	console.log(new Date().toLocaleString())
// 	db.colse()
// })

/*
.insert([{
	url: "E"
}, {
	url: "D"
}]).then(function(t) {
	console.log(t)
}).catch(function(e) {
	console.log(e)
})
*/


/*
Page.writer(["A", "B"]).then(function() {
	return Page.find()
}).then(function(r) {
	console.log(r);
	return //Page.clear()
}).then(function(r) {
	return Page.find()
}).then(function(r) {
	console.log(r);
}).catch(function(e) {

	console.log(e);
})
*/


// var db = new DB;
// db.open("articles").then(function(collection) {
// 	return collection.update()

// }).then(function(data) {
// 	console.log(data)
// })