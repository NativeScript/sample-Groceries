var applicationModule = require("application");
var navigation = require("./shared/navigation");

if (applicationModule.ios) {
	var AppDelegate = UIResponder.extend({
		applicationDidFinishLaunchingWithOptions: function () {
			UIApplication.sharedApplication().statusBarStyle = UIStatusBarStyle.LightContent;
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
