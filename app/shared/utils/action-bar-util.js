var frameModule = require("ui/frame");

exports.styleActionBar = function() {
	var topmost = frameModule.topmost();
	if (topmost.ios) {
		// Make the iOS status bar use white text
		var navigationBar = topmost.ios.controller.navigationBar;
		navigationBar.barStyle = 1;
	}
};

exports.hideiOSBackButton = function() {
	var topmost = frameModule.topmost();
	if (topmost.ios) {
		// Hide the Back arrow
		var controller = topmost.ios.controller;
		controller.visibleViewController.navigationItem.setHidesBackButtonAnimated(true, false);
	}
};