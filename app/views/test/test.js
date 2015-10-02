var observableModule = require("data/observable");
var observableArrayModule = require("data/observable-array");

var groceryList = new observableArrayModule.ObservableArray([]);
var pageData = new observableModule.Observable({
	groceryList: groceryList
});
var list;

exports.loaded = function(args) {
	var page = args.object;
	list = page.getViewById("list");
	if (list._ios) {
		list._ios.cellSwipeLimits = UIEdgeInsetsFromString("{0, 60, 0, 60}");
	}

	for (var i = 0; i < 1000; i++) {
		groceryList.push({ name: Math.random() * 100 });
	}

	page.bindingContext = pageData;
};

exports.shouldRefreshOnPull = function(args) {
	args.returnValue = true;
	setTimeout(function() {
		for (var i = 0; i < 5; i++) {
			groceryList.splice(i, 0, { name : "New item" });
		}
		list.didRefreshOnPull();
	}, 3000);
}