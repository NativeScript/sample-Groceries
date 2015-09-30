var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var formUtil = require("../../shared/utils/form-util");
var UserViewModel = require("../../shared/view-models/user-view-model");

var user = new UserViewModel({
	email: "tj.vantoll@gmail.com",
	password: "password",
	authenticating: false
});

var email;
var password;

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = user;

	// Change the color and style of the iOS UINavigationBar
	if (page.ios) {
		var navigationBar = frameModule.topmost().ios.controller.navigationBar;
		navigationBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.011, 0.278, 0.576, 1);
		navigationBar.titleTextAttributes = new NSDictionary([UIColor.whiteColor()], [NSForegroundColorAttributeName]);
		navigationBar.barStyle = 1;
		navigationBar.tintColor = UIColor.whiteColor();

		// Enable IQKeyboardManager from the NativeScript-IQKeyboardManager plugin
		IQKeyboardManager.sharedManager().enable = true;
	}

	email = page.getViewById("email");
	password = page.getViewById("password");
	formUtil.hideKeyboardOnBlur(page, [email, password]);
};

function disableForm() {
	email.editable = false;
	password.editable = false;
	user.set("authenticating", true);
}
function enableForm() {
	email.editable = true;
	password.editable = true;
	user.set("authenticating", false);
}

exports.signIn = function() {
	// Don't send off multiple requests at the same time
	if (user.get("authenticating")) {
		return;
	}

	disableForm();
	user.login()
		.then(function() {
			frameModule.topmost().navigate("views/list/list");
		})
		.catch(function(error) {
			console.log(error);
			dialogsModule.alert({
				message: "Unfortunately we could not find your account.",
				okButtonText: "OK"
			});
		})
		.then(enableForm);
};

exports.register = function() {
	var topmost = frameModule.topmost();
	topmost.navigate("views/register/register");
};

exports.forgotPassword = function() {
	var topmost = frameModule.topmost();
	topmost.navigate("views/password/password");
};
