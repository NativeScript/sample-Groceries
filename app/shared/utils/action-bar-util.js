var frameModule = require("ui/frame");

exports.styleActionBar = function() {
	var topmost = frameModule.topmost();
	if (topmost.ios) {
		var navigationBar = topmost.ios.controller.navigationBar;
		navigationBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.011, 0.278, 0.576, 1);
		navigationBar.titleTextAttributes = new NSDictionary([UIColor.whiteColor()], [NSForegroundColorAttributeName]);
		navigationBar.barStyle = 1;
		navigationBar.tintColor = UIColor.whiteColor();
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