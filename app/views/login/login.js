var dialogs = require("ui/dialogs");
var frameModule = require("ui/frame");
var User = require("../../shared/models/User");

var user = new User();

exports.load = function(args) {
	var page = args.object;

	user.set("email_address", "tj.vantoll@gmail.com");
	user.set("password", "password");

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
			frameModule.topmost().navigate("./views/list/list");
		}).catch(function() {
			dialogs.alert({
				message: "Unfortunately we could not find your account.",
				okButtonText: "OK"
			});
		});
};

exports.register = function() {
	var topmost = frameModule.topmost();
	topmost.navigate("./views/register/register");
};
