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
var signInButton;

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = user;

	email = page.getViewById("email");
	password = page.getViewById("password");
	signInButton = page.getViewById("signInButton");

	email.addEventListener("returnPress", function() {
		password.focus();
	});
	password.addEventListener("returnPress", signIn);

	// Change the color and style of the iOS UINavigationBar
	if (page.ios) {
		var navigationBar = frameModule.topmost().ios.controller.navigationBar;
		navigationBar.barTintColor = UIColor.colorWithRedGreenBlueAlpha(0.011, 0.278, 0.576, 1);
		navigationBar.titleTextAttributes = new NSDictionary([UIColor.whiteColor()], [NSForegroundColorAttributeName]);
		navigationBar.barStyle = 1;
		navigationBar.tintColor = UIColor.whiteColor();
	}

	// Prevent the first textfield from receiving focus on Android
	// See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
	if (page.android) {
		var layout = page.getViewById("layout").android;
		layout.setFocusableInTouchMode(true);
		layout.setFocusable(true);
		email.android.clearFocus();
	}

	formUtil.hideKeyboardOnBlur(page, [email, password]);
};

function disableForm() {
	email.isEnabled = false;
	password.isEnabled = false;
	signInButton.isEnabled = false;
	user.set("authenticating", true);
}
function enableForm() {
	email.isEnabled = true;
	password.isEnabled = true;
	signInButton.isEnabled = true;
	user.set("authenticating", false);
}

function signIn() {
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
}

exports.signIn = signIn;

exports.register = function() {
	var topmost = frameModule.topmost();
	topmost.navigate("views/register/register");
};

exports.forgotPassword = function() {
	var topmost = frameModule.topmost();
	topmost.navigate("views/password/password");
};
