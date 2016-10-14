var applicationModule = require("application");
var utilsModule = require("utils/utils");
var navigation = require("./shared/navigation");

if (applicationModule.ios) {
	var AppDelegate = UIResponder.extend({
		applicationDidFinishLaunchingWithOptions: function () {
			utilsModule.ios.getter(UIApplication, UIApplication.sharedApplication).statusBarStyle = UIStatusBarStyle.LightContent;
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
