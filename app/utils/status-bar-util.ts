import * as application from "application";

// Make TypeScript happy
declare var UIResponder: any;
declare var UIStatusBarStyle: any;
declare var UIApplication: any;
declare var UIApplicationDelegate: any;

export function setStatusBarColors() {
  if (application.ios) {
    var AppDelegate = UIResponder.extend({
      applicationDidFinishLaunchingWithOptions: function() {
        UIApplication.sharedApplication().statusBarStyle = UIStatusBarStyle.LightContent;
        return true;
      }
    }, {
        name: "AppDelegate",
        protocols: [UIApplicationDelegate]
      });
    application.ios.delegate = AppDelegate;
  }
}
