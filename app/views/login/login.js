var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var UserViewModel = require("../../shared/view-models/user-view-model");

var user = new UserViewModel({
	email: "tj.vantoll@gmail.com",
	password: "password"
});

exports.loaded = function(args) {
	var page = args.object;

	if (page.ios) {
		var navigationBar = frameModule.topmost().ios.controller.navigationBar;
		navigationBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.011, 0.278, 0.576, 1);
		navigationBar.titleTextAttributes = new NSDictionary([UIColor.whiteColor()], [NSForegroundColorAttributeName]);
		navigationBar.barStyle = 1;
		navigationBar.tintColor = UIColor.whiteColor();
	}

	page.bindingContext = user;
};

exports.signIn = function() {
	user.login()
		.then(function() {
			frameModule.topmost().navigate("views/list/list");
		}).catch(function(error) {
			console.log(error);
			dialogsModule.alert({
				message: "Unfortunately we could not find your account.",
				okButtonText: "OK"
			});
		});
};

exports.register = function() {
	var topmost = frameModule.topmost();
	topmost.navigate("views/register/register");
};
