var dialogsModule = require("ui/dialogs");
var formUtil = require("../../shared/utils/form-util");
var UserViewModel = require("../../shared/view-models/user-view-model");

var user = new UserViewModel({ authenticating: false });
var email;

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = user;

	user.set("email", "");

	email = page.getViewById("email");
	formUtil.hideKeyboardOnBlur(page, [email]);
};

function disableForm() {
	// TODO: Why does this crash Android?
	// email.editable = false;
	user.set("authenticating", true);
}
function enableForm() {
	email.editable = true;
	user.set("authenticating", false);
}

exports.reset = function() {
	// Don't send off multiple requests at the same time
	if (user.get("authenticating")) {
		return;
	}

	if (user.isValidEmail()) {
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
	} else {
		dialogsModule.alert({
			message: "Enter a valid email address.",
			okButtonText: "OK"
		});
	}
};
