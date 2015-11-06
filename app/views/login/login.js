var dialogsModule = require("ui/dialogs");
var actionBarUtil = require("../../shared/utils/action-bar-util");
var formUtil = require("../../shared/utils/form-util");
var navigation = require("../../shared/navigation");
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
	signInButton = page.getViewById("sign-in-button");
	formUtil.hideKeyboardOnBlur(page, [email, password]);

	actionBarUtil.hideiOSBackButton();
	actionBarUtil.styleActionBar();

	// Prevent the first textfield from receiving focus on Android
	// See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
	if (page.android) {
		var layout = page.getViewById("layout").android;
		layout.setFocusableInTouchMode(true);
		layout.setFocusable(true);
		email.android.clearFocus();
	}
};

exports.focusPassword = function() {
	password.focus();
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

exports.signIn = function() {
	disableForm();
	user.login()
		.catch(function(error) {
			dialogsModule.alert({
				message: "Unfortunately we could not find your account.",
				okButtonText: "OK"
			});
		})
		.then(enableForm)
		.then(navigation.goToListPage);
};

exports.register = navigation.goToRegisterPage;
exports.forgotPassword = navigation.goToPasswordPage;
