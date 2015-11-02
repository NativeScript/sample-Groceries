var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var formUtil = require("../../shared/utils/form-util");
var UserViewModel = require("../../shared/view-models/user-view-model");

var user = new UserViewModel({ authenticating: false });
var email;
var password;
var signUpButton;

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = user;

	user.set("email", "");
	user.set("password", "");

	email = page.getViewById("email");
	password = page.getViewById("password");
	signUpButton = page.getViewById("sign-up-button");
	formUtil.hideKeyboardOnBlur(page, [email, password]);
};

exports.focusPassword = function() {
	password.focus();
};

function disableForm() {
	email.isEnabled = false;
	password.isEnabled = false;
	signUpButton.isEnabled = false;
	user.set("authenticating", true);
}
function enableForm() {
	email.isEnabled = true;
	password.isEnabled = true;
	signUpButton.isEnabled = true;
	user.set("authenticating", false);
}

function completeRegistration() {
	disableForm();
	user.register()
		.then(function() {
			dialogsModule
				.alert("Your account was successfully created.")
				.then(function() {
					frameModule.topmost().navigate("views/login/login");
				});
		}).catch(function() {
			dialogsModule
				.alert({
					message: "Unfortunately we were unable to create your account.",
					okButtonText: "OK"
				});
		}).then(enableForm);
}

exports.register = function() {
	if (user.isValidEmail()) {
		completeRegistration();
	} else {
		dialogsModule.alert({
			message: "Enter a valid email address.",
			okButtonText: "OK"
		});
	}
};
