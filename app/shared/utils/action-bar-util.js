var frameModule = require("ui/frame");

exports.styleActionBar = function() {
	var topmost = frameModule.topmost();
	if (topmost.ios) {
		// Make the iOS status bar use white text
		// Yes, UIBarStyleBlack = white text, because logic
		var navigationBar = topmost.ios.controller.navigationBar;
		navigationBar.barStyle = UIBarStyle.UIBarStyleBlack;
	}
};
