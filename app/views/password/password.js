var dialogsModule = require("ui/dialogs");
var formUtil = require("../../shared/utils/form-util");
var UserViewModel = require("../../shared/view-models/user-view-model");

var user = new UserViewModel({ authenticating: false });
var email;
var resetButton;

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = user;

	user.set("email", "");

	email = page.getViewById("email");
	resetButton = page.getViewById("resetButton");
	email.addEventListener("returnPress", reset);

	formUtil.hideKeyboardOnBlur(page, [email]);
};

function disableForm() {
	email.isEnabled = false;
	resetButton.isEnabled = false;
	user.set("authenticating", true);
}
function enableForm() {
	email.isEnabled = true;
	resetButton.isEnabled = true;
	user.set("authenticating", false);
}

function reset() {
	if (!user.isValidEmail()) {
		dialogsModule.alert({
			message: "Enter a valid email address.",
			okButtonText: "OK"
		});
		return;
	}

	disableForm();
	user.resetPassword()
		.then(function() {
			dialogsModule.alert({
				message: "Your password was successfully reset. Please check your email for instructions on choosing a new password.",
				okButtonText: "OK"
			});
		})
		.catch(function() {
			dialogsModule.alert({
				message: "Unfortunately, an error occurred resetting your password.",
				okButtonText: "OK"
			});
		})
		.then(enableForm);
}

exports.reset = reset;
