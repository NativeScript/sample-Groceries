var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var utilsModule = require("utils/utils");

var socialShare = require("nativescript-social-share");
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");
var statusBarUtil = require("../../shared/utils/status-bar-util");
var navigation = require("../../shared/navigation");

var page;
var drawerElement;
var groceryListElement;
var mainContentElement;

var groceryList = new GroceryListViewModel([]);
var history = groceryList.history();
var pageData = new Observable({
	grocery: "",
	groceryList: groceryList,
	history: history,
	isShowingRecent: false,
	toggleDone: function(args) {
		var item = args.view.bindingContext;
		var parent = args.view.parent;

		showPageLoadingIndicator();
		groceryList.toggleDone(groceryList.indexOf(item))
			.catch(handleAddError)
			.then(function() {
				hidePageLoadingIndicator();
				parent.animate({
					opacity: item.done ? 0.8 : 1
				});
			});
	},
	toggleHistory: function(args) {
		var item = args.view.bindingContext;
		groceryList.toggleDoneHistory(history.indexOf(item));
	}
});

exports.loaded = function(args) {
	page = args.object;
	page.bindingContext = pageData;
	statusBarUtil.configure();

	drawerElement = page.getViewById("drawer");
	groceryListElement = page.getViewById("grocery-list");
	mainContentElement = page.getViewById("main-content");

	// Set the hint color for Android
	var groceryElement = page.getViewById("grocery");
	if (groceryElement.android) {
		var color = android.graphics.Color.parseColor("#FFFFFF");
		groceryElement.android.setHintTextColor(color);
	}

	// Set the hint color for iOS
	if (groceryElement.ios) {
		groceryElement.ios.attributedPlaceholder = NSAttributedString.alloc().initWithStringAttributes(
			groceryElement.hint,
			new NSDictionary([UIColor.whiteColor()], [NSForegroundColorAttributeName]));
	}

	showPageLoadingIndicator();
	groceryList
		.load()
		.catch(function(error) {
			console.log(error);
			dialogsModule.alert({
				message: "An error occurred while loading your grocery list.",
				okButtonText: "OK"
			});
		})
		.then(function() {
			hidePageLoadingIndicator();

			// Fade in the ListView over 1 second
			groceryListElement.animate({
				opacity: 1,
				duration: 1000
			});
		});
};

exports.add = function() {
	if (pageData.get("isShowingRecent")) {
		return;
	}

	if (pageData.get("grocery").trim() === "") {
		dialogsModule.alert({
			message: "Enter a grocery item.",
			okButtonText: "OK"
		});
		return;
	}

	showPageLoadingIndicator();
	page.getViewById("grocery").dismissSoftInput();
	groceryList
		.add(pageData.get("grocery"))
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

exports.toggleRecent = function() {
	var isShowingRecent = !pageData.get("isShowingRecent");
	pageData.set("isShowingRecent", isShowingRecent);

	if (!isShowingRecent) {
		addFromHistory();
	}
};

function addFromHistory() {
	showPageLoadingIndicator();
	groceryList.restore()
		.catch(handleAddError)
		.then(hidePageLoadingIndicator);
};

exports.menu = function() {
	drawerElement.toggleDrawerState();
};

exports.share = function() {
	var list = [];
	for (var i = 0, size = groceryList.length; i < size ; i++) {
		list.push(groceryList.getItem(i).name);
	}
	var listString = list.join(", ").trim();
	socialShare.shareText(listString);
};

exports.signOut = navigation.signOut;

exports.itemSwipeProgressStarted = function(args) {
	var swipeLimits = args.data.swipeLimits;
	swipeLimits.threshold = 50 * utilsModule.layout.getDisplayDensity();

	// Workaround https://github.com/telerik/nativescript-ui/issues/277
	var swipeDistance = 50 * utilsModule.layout.getDisplayDensity();
	swipeLimits.left = page.android ? swipeDistance : 0;
	swipeLimits.right = page.android ? 0 : swipeDistance;
};
exports.itemSwipeProgressEnded = function(args) {
	if (args.data.x <= -(50 * utilsModule.layout.getDisplayDensity())) {
		swipeDelete(args.itemIndex);
	}
};

function swipeDelete(index) {
	showPageLoadingIndicator();
	groceryList.delete(index)
		.catch(handleAddError)
		.then(hidePageLoadingIndicator);
}

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

exports.pullToRefreshInitiated = function() {
	groceryList.load().then(function() {
		groceryListElement.notifyPullToRefreshFinished();
	});
};
