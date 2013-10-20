exports.objectToJsonString = function (obj) {
	return JSON.stringify(obj, null, 4);
};

exports.isArray = function(obj) {
	return Object.prototype.toString.call(obj) == '[object Array]';
};

exports.isInArray = function(arr, object) {
	return arr.indexOf(object) != -1;
};

exports.stringContainsString = function(haystack, needle) {
	return haystack.indexOf(needle) != -1;
};

exports.implode = function(arr, glue) {
	return arr.reduce(function(str, item) {
		return (str == '' ? item : str + glue + item);
	}, '');
};

exports.objKeys = function(obj) {
	var keys = [];
	for (var key in obj) {
		if (!obj.hasOwnProperty(key)) continue;
		keys.push(key);
	}
	return keys;
};
