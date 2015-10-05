var applicationModule = require("application");
var colorModule = require("color");
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

var firstTime = true;
var groceryList = new GroceryListViewModel([]);
var history = groceryList.history();
var pageData = new observableModule.Observable({
	grocery: "",
	groceryList: groceryList,
	history: history
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

		// Add listeners
		if (firstTime) {
			applicationModule.ios.addNotificationObserver("UITextFieldTextDidEndEditingNotification", function() {
				if (pageData.get("grocery").trim() !== "") {
					add();
				}
			});
		}

		groceryListElement._ios.pullToRefreshView.backgroundColor = new colorModule.Color("white").ios;
	}

	groceryList.empty();

	showPageLoadingIndicator();
	groceryList.load().then(function() {
		hidePageLoadingIndicator();

		// Fade in the ListView over 1 second
		groceryListElement.animate({
			opacity: 1,
			duration: 1000
		});
	});

	firstTime = false;
};

function add() {
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
}

exports.signOut = function() {
	frameModule.topmost().goBack();
};

exports.history = function() {
	drawerElement.toggleDrawerState();
};

exports.toggleHistory = function(args) {
	var item = args.view.bindingContext;
	groceryList.toggleDoneHistory(history.indexOf(item));
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

exports.didFinishSwipeCell = function(args) {
	var offset = args.data;
	if (offset.x < 0) {
		performDelete(args.itemIndex);
	} else {
		performToggleDone(args.itemIndex);
	}
};

function performDelete(index) {
	showPageLoadingIndicator();
	groceryList.delete(index)
		.catch(handleAddError)
		.then(hidePageLoadingIndicator);
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

exports.toggleDone = function(args) {
	var item = args.view.bindingContext;
	performToggleDone(groceryList.indexOf(item));
};


function DrawerCallbacksModel() {}
DrawerCallbacksModel.prototype = new dependencyObservableModule.DependencyObservable();
DrawerCallbacksModel.prototype.onDrawerOpening = function () {
	mainContentElement.animate({
		duration: 250,
		opacity: 0.5
	});
};
DrawerCallbacksModel.prototype.onDrawerOpened = function () {};
DrawerCallbacksModel.prototype.onDrawerClosing = function () {
	mainContentElement.animate({
		duration: 250,
		opacity: 1
	});
};
DrawerCallbacksModel.prototype.onDrawerClosed = function () {};
