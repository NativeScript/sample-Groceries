var observableModule = require("data/observable");
var observableArrayModule = require("data/observable-array");

var dataList = new observableArrayModule.ObservableArray([]);
var pageData = new observableModule.Observable({
	dataList: dataList
});
var list;

exports.loaded = function(args) {
	var page = args.object;
	list = page.getViewById("list");

	for (var i = 0; i < 1000; i++) {
		dataList.push({ name: Math.ceil(Math.random() * 100) });
	}

	page.bindingContext = pageData;
};
