var applicationModule = require("application");
var frameModule = require("ui/frame");
var platform = require("platform");

exports.configure = function() {
	var topmost = frameModule.topmost();
	if (topmost.ios) {
		// Make the iOS status bar use white text
		// Yes, UIBarStyleBlack = white text, because logic
		var navigationBar = topmost.ios.controller.navigationBar;
		navigationBar.barStyle = UIBarStyle.UIBarStyleBlack;
	}

	// Make the Android status bar transparent.
	// See http://bradmartin.net/2016/03/10/fullscreen-and-navigation-bar-color-in-a-nativescript-android-app/
	if (applicationModule.android && platform.device.sdkVersion >= "21") {
			var View = android.view.View;
			var window = applicationModule.android.startActivity.getWindow();
			window.setStatusBarColor(0x000000);

			var decorView = window.getDecorView();
			decorView.setSystemUiVisibility(
					View.SYSTEM_UI_FLAG_LAYOUT_STABLE
					| View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
					| View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
					| View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
	}
};