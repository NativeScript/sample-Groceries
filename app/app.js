var applicationModule = require("application");
var navigation = require("./shared/navigation");

if (applicationModule.ios) {
  var AppDelegate = UIResponder.extend({
  	applicationDidFinishLaunchingWithOptions: function () {
  		// TODO: Switch to UIStatusBarStyle.LightContent after figuring out where
  		// that white background is coming from
  		UIApplication.sharedApplication().statusBarStyle = UIStatusBarStyle.Default;
  		return true;
  	}
  }, {
  	name: "AppDelegate",
  	protocols: [UIApplicationDelegate]
  });
  applicationModule.ios.delegate = AppDelegate;
}

applicationModule.start({
	moduleName: navigation.startingPage()
});
