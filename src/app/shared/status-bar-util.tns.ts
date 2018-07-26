import * as application from "tns-core-modules/application";
import * as platform from "tns-core-modules/platform";
import * as utils from "tns-core-modules/utils/utils";

declare var android: any;
declare var UIStatusBarStyle: any;
declare var UIApplication: any;

export function setStatusBarColors() {
  // Make the iOS status bar transparent with white text.
  if (application.ios) {
    application.on("launch", () => {
      utils.ios.getter(UIApplication, UIApplication.sharedApplication).statusBarStyle = UIStatusBarStyle.LightContent;
    });
  }

  // Make the Android status bar transparent.
  // See http://bradmartin.net/2016/03/10/fullscreen-and-navigation-bar-color-in-a-nativescript-android-app/
  // for details on the technique used.
  if (application.android && platform.device.sdkVersion >= "21") {
    application.android.on("activityStarted", () => {
      const View = android.view.View;
      const window = application.android.startActivity.getWindow();
      window.setStatusBarColor(0x000000);

      const decorView = window.getDecorView();
      decorView.setSystemUiVisibility(
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    });
  }
}
