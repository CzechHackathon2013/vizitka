var fs = require("fs"),
	assert = require('assert'),
    path = require('path'),
    os = require('os'),
	nodeFs = require('node-fs'),
	clc = require('cli-color'),
	prompt = require('prompt'),
	readline = require('readline'),
	jsonDiff = require('../utils/json-diff/json-diff.js'),
	Zip = require("node-zip"),
	crypto = require('crypto');

exports.bind = function (fn, scope) {
	return function () {
		return fn.apply(scope, arguments);
	}
};

exports.diffStringFixed = function(json1, json2, options) {
	var diff = jsonDiff.diffString(json1, json2, options);
	if (diff.match(/\s*undefined\n/)) {
		diff = "";
	}
	return diff;
};

exports.capitaliseFirstLetter = function(string)
{
	return string.charAt(0).toUpperCase() + string.slice(1);
};

/*
exports.zeroFill = function (number, width) {
	var input = number + "";  // make sure it's a string
	return(fillZeroes.slice(0, width - input.length) + input);
};
*/

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

var _bfs = function (obj, functor, path, key, parent, isRoot) {
	// array needs to be first - as every array is object as well
	if (exports.isArray(obj)) {
		for (var i = 0, l = obj.length; i < l; i++) {
			path.push('['+i+']');
			functor(obj[i], i, obj, path);
			_bfs(obj[i], functor, path, i, obj, false);
			path.pop();
		}
	} else if (typeof obj == "object" /* && !(parent[k] instanceof String)*/) { // we need to rule out strings otherwise we iterate by letters? :)

		// first functor, to allow renaming keys
		for (var k in obj) {
			if (!obj.hasOwnProperty(k)) continue;

			path.push(k);
			functor(obj[k], k, obj, path);
			path.pop();
		}

		// then iterate
		for (var k in obj) {
			if (!obj.hasOwnProperty(k)) continue;

			path.push(k);
			_bfs(obj[k], functor, path, k, obj, false);
			path.pop();
		}
	} else if (isRoot) {
		functor(obj, null, null, path);
	}
};

/**
 *
 * @param obj
 * @param functor function(value, key, parent, path (= array of keys))
 */
exports.bfs = function(obj, functor) {
	_bfs(obj, functor, [], null, null, true);
};

/**
 * Merge all arrays passed as arguments, last duplicate wins
 * */
exports.mergeArrays = function() {
	assert.ok(arguments.length > 0);

	var tmpObj = {};

	for (var i = 0, l = arguments.length; i<l; i++) {
		arguments[i].map(function(item) {
			tmpObj[item] = true;
		});
	}

	return exports.objKeys(tmpObj);
};

exports.toArrayBuffer = function(buffer) {
	var ab = new ArrayBuffer(buffer.length);
	var view = new Uint8Array(ab);
	for (var i = 0; i < buffer.length; ++i) {
		view[i] = buffer[i];
	}
	return ab;
};

exports.md5 = function(data) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(data);
	return md5sum.digest('hex');
};

exports.stupidDeepClone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
};

// http://stackoverflow.com/a/1830844/38729
exports.stringIsNumber = function (str) {
	return str == parseInt(str, 10).toString();
};

exports.numericCompare = function (a, b) {
	return parseInt(a, 10) - parseInt(b, 10);
};

// FILE SYSTEM

exports.ensureFolderExistsSync = function (folderPath) {
	nodeFs.mkdirSync(folderPath, 0777, true);
};

exports.ensureFolderForFileExistsSync = function (filePath) {
	var folderPath = path.dirname(filePath);
	nodeFs.mkdirSync(folderPath, 0777, true);
};

exports.normalizePathForwardSlashes= function (filePath) {
	return path.normalize(filePath).replace(/\\/g, '/');
};

exports.rmdirRecursiveSync = function(dir) {
	var list = fs.readdirSync(dir);
	for(var i = 0; i < list.length; i++) {
		var filename = path.join(dir, list[i]);
		var stat = fs.statSync(filename);

		if(filename == "." || filename == "..") {
			// pass these files
		} else if(stat.isDirectory()) {
			// rmdir recursively
			exports.rmdirRecursiveSync(filename);
		} else {
			// rm filename
			fs.unlinkSync(filename);
		}
	}
	fs.rmdirSync(dir);
};

// PLATFORM

exports.isMac = function() {
    return os.platform() == 'darwin';
};

// CONSOLE

// prompt wrapper
// callback(err, answer)
exports.ask = function(question, callback) {
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.question(question + ' ', function(answer) {
		rl.close();

		callback(null, answer);
	});
//	prompt.get([question], function (err, result) {
//		var answer = result.hasOwnProperty(question) ? result[question] : null;
//		callback(err, answer);
//	});
};

// DEBUG

// for debug
exports.log = console.log;

// for errors, todo: red
exports.error = console.log;

// for progress messages
exports.write = console.log;
