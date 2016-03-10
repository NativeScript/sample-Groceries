var applicationModule = require("application");
var navigation = require("./shared/navigation");

var AppDelegate = UIResponder.extend({
	applicationDidFinishLaunchingWithOptions: function () {
		// Set the status bar to light content
		UIApplication.sharedApplication().statusBarStyle = UIStatusBarStyle.LightContent;
		return true;
	}
}, {
	name: "AppDelegate",
	protocols: [UIApplicationDelegate]
});
applicationModule.ios.delegate = AppDelegate;

applicationModule.start({
	moduleName: navigation.startingPage()
});
