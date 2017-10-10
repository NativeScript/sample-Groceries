var application = require("application");
var platform = require("platform");
var utils = require("utils/utils");

exports.setStatusBarColors = function() {
  // Make the iOS status bar transparent with white text.
  // See https://github.com/burkeholland/nativescript-statusbar/issues/2
  // for details on the technique used.
  if (application.ios) {
    var AppDelegate = UIResponder.extend({
      applicationDidFinishLaunchingWithOptions: function() {
        utils.ios.getter(UIApplication, UIApplication.sharedApplication).statusBarStyle = UIStatusBarStyle.LightContent;
        return true;
      }
    }, {
        name: "AppDelegate",
        protocols: [UIApplicationDelegate]
      });
    application.ios.delegate = AppDelegate;
  }

  // Make the Android status bar transparent.
  // See http://bradmartin.net/2016/03/10/fullscreen-and-navigation-bar-color-in-a-nativescript-android-app/
  // for details on the technique used.
  if (application.android) {
    application.android.onActivityStarted = function() {
      if (application.android && platform.device.sdkVersion >= "21") {
        var View = android.view.View;
        var window = application.android.startActivity.getWindow();
        window.setStatusBarColor(0x000000);

        var decorView = window.getDecorView();
        decorView.setSystemUiVisibility(
          View.SYSTEM_UI_FLAG_LAYOUT_STABLE
          | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
          | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
          | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
      }
    }
  }
}
