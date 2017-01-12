var Helper = {
	arrayToMatrix: function(arr, limit) {
		var max = arr.length;

		if (limit == 0 || limit > max) {
			limit = max;
		}
		var stepSize = Math.ceil(max / limit);
		var list = [];
		var count = 0;
		for (let i = 0; i < stepSize; i++) {
			var arrItem = [];
			for (let j = 0; j < limit; j++) {
				if (count < max) {
					arrItem.push(arr[count++])
				}
			}
			list.push(arrItem);
		}
		return list;
	},
	iteratorArr: function(arr, promiseCallback) {
		var it = arr[Symbol.iterator]();
		var list = [];

		return x(it.next());

		function x(item) {
			if (item.done) {
				return Promise.resolve(list);
			}
			return promiseCallback(item.value).then(function(value) {
				return list.push(value);
			}).then(function() {
				return x(it.next());
			}).catch(Promise.reject)
		}
	},
	iteratorArrAsync: function(arr, promiseCallback) {
		var promises = arr.map(promiseCallback);
		return Promise.all(promises)
	}
}


module.exports = Helper;