var observableModule = require("data/observable");
var observableArrayModule = require("data/observable-array");

var numberList = new observableArrayModule.ObservableArray([]);
var pageData = new observableModule.Observable({
	numberList: numberList
});
var list;

exports.loaded = function(args) {
	var page = args.object;
	list = page.getViewById("list");

	for (var i = 0; i < 1000; i++) {
		numberList.push({ name: Math.ceil(Math.random() * 100) });
	}

	page.bindingContext = pageData;
};

exports.shouldRefreshOnPull = function(args) {
	args.returnValue = true;
	setTimeout(function() {
		for (var i = 0; i < 3; i++) {
			numberList.splice(i, 0, { name : "New item" });
		}
		list.didRefreshOnPull();
	}, 3000);
}