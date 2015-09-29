var dialogsModule = require("ui/dialogs");
var observableModule = require("data/observable");

var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");

var page;
var groceryList = new GroceryListViewModel([]);
var pageData = new observableModule.Observable({
	grocery: "",
	groceryList: groceryList
});

exports.loaded = function(args) {
	page = args.object;

	if (page.ios) {
		var listView = page.getViewById("groceryList");
		swipeDelete.enable(listView, function(index) {
			performDelete(index);
		});
	}

	page.bindingContext = pageData;

	groceryList.empty();

	pageData.set("isLoading", true);
	groceryList.load().then(function() {
		pageData.set("isLoading", false);

		// Fade in the ListView over 1 second
		page.getViewById("groceryList").animate({
			opacity: 1,
			duration: 1000
		});
	});
};

exports.add = function() {
	// Check for empty submission
	if (pageData.get("grocery").trim() !== "") {
		pageData.set("isLoading", true);
		page.getViewById("grocery").dismissSoftInput();
		groceryList.add(pageData.get("grocery"))
			.catch(function(error) {
				console.log(error);
				dialogsModule.alert({
					message: "An error occurred while adding an item to your list.",
					okButtonText: "OK"
				});
			})
			.then(function() {
				pageData.set("isLoading", false);
			});

		// Clear the textfield
		pageData.set("grocery", "");
	} else {
		dialogsModule.alert({
			message: "Enter a grocery item",
			okButtonText: "OK"
		});
	}
};

exports.share = function() {
	var list = [];
	for (var i = 0, size = groceryList.length; i < size ; i++) {
		list.push(groceryList.getItem(i).name);
	}
	var listString = list.join(", ").trim();
	socialShare.shareText(listString);
};

function performDelete(index) {
	pageData.set("isLoading", true);
	groceryList.delete(index)
		.catch(function(error) {
			console.log(error);
			dialogsModule.alert({
				message: "An error occurred while adding an item to your list.",
				okButtonText: "OK"
			});
		})
		.then(function() {
			pageData.set("isLoading", false);
		});
}

exports.delete = function(args) {
	var item = args.view.bindingContext;
	performDelete(groceryList.indexOf(item));
};
