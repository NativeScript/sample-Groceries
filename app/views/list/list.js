var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var dependencyObservableModule = require("ui/core/dependency-observable");

var socialShare = require("nativescript-social-share");
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");

var page;
var drawerElement;
var groceryListElement;
var mainContentElement;

var groceryList = new GroceryListViewModel([]);
var history = groceryList.history();
var pageData = new observableModule.Observable({
	grocery: "",
	groceryList: groceryList,
	history: history,

	// TODO: Move this out of the data model
	// See https://github.com/telerik/nativescript-ui/issues/72
	toggleDone: function(args) {
		var item = args.view.bindingContext;
		performToggleDone(groceryList.indexOf(item));
	},
	swipeDelete: function(args) {
		var item = args.view.bindingContext;
		showPageLoadingIndicator();
		groceryList.delete(groceryList.indexOf(item))
			.catch(handleAddError)
			.then(hidePageLoadingIndicator);
	},
	toggleHistory: function(args) {
		var item = args.view.bindingContext;
		groceryList.toggleDoneHistory(history.indexOf(item));
	}
});

exports.loaded = function(args) {
	page = args.object;
	page.bindingContext = pageData;

	drawerElement = page.getViewById("drawer");
	drawerElement.delegate = new DrawerCallbacksModel();
	groceryListElement = page.getViewById("groceryList");
	mainContentElement = page.getViewById("mainContent");

	if (page.ios) {
		// Hide the Back arrow
		var controller = frameModule.topmost().ios.controller;
		controller.visibleViewController.navigationItem.setHidesBackButtonAnimated(true, false);
	}
	if (page.android) {
		groceryListElement._swipeExecuteBehavior.setAutoDissolve(false);
	}

	showPageLoadingIndicator();
	groceryList.load().then(function() {
		hidePageLoadingIndicator();

		// Fade in the ListView over 1 second
		groceryListElement.animate({
			opacity: 1,
			duration: 1000
		});
	});
};

exports.add = function() {
	if (pageData.get("grocery").trim() === "") {
		return;
	}

	showPageLoadingIndicator();
	page.getViewById("grocery").dismissSoftInput();
	groceryList.add(pageData.get("grocery"))
		.catch(function(error) {
			console.log(error);
			dialogsModule.alert({
				message: "An error occurred while adding an item to your list.",
				okButtonText: "OK"
			});
		})
		.then(hidePageLoadingIndicator);

	// Clear the textfield
	pageData.set("grocery", "");
};

exports.signOut = function() {
	frameModule.topmost().goBack();
};

exports.history = function() {
	drawerElement.toggleDrawerState();
};

exports.addFromHistory = function() {
	pageData.set("isHistoryLoading", true);
	groceryList.restore()
		.catch(handleAddError)
		.then(function() {
			pageData.set("isHistoryLoading", false);
		});
};

exports.share = function() {
	var list = [];
	for (var i = 0, size = groceryList.length; i < size ; i++) {
		list.push(groceryList.getItem(i).name);
	}
	var listString = list.join(", ").trim();
	socialShare.shareText(listString);
};

function handleAddError(error) {
	console.log(error);
	dialogsModule.alert({
		message: "An error occurred while adding an item to your list.",
		okButtonText: "OK"
	});
}

function showPageLoadingIndicator() {
	pageData.set("isLoading", true);
}
function hidePageLoadingIndicator() {
	pageData.set("isLoading", false);
}

exports.startSwipeCell = function(args) {
	args.data.swipeLimits.left = page.ios ? 60 : 180;
	args.data.swipeLimits.right = page.ios ? 60 : 180;
};

function performToggleDone(index) {
	showPageLoadingIndicator();
	groceryList.toggleDone(index)
		.catch(handleAddError)
		.then(hidePageLoadingIndicator);
}

exports.shouldRefreshOnPull = function(args) {
	args.returnValue = true;
	groceryList.load().then(function() {
		groceryListElement.didRefreshOnPull();
	});
};

function DrawerCallbacksModel() {}
DrawerCallbacksModel.prototype = new dependencyObservableModule.DependencyObservable();
DrawerCallbacksModel.prototype.onDrawerOpening = function () {
	if (page.ios) {
		mainContentElement.animate({
			duration: 250,
			opacity: 0.5
		});
	}
};
DrawerCallbacksModel.prototype.onDrawerOpened = function () {};
DrawerCallbacksModel.prototype.onDrawerClosing = function () {
	if (page.ios) {
		mainContentElement.animate({
			duration: 250,
			opacity: 1
		});
	}
};
DrawerCallbacksModel.prototype.onDrawerClosed = function () {};
