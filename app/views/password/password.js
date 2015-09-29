var dialogsModule = require("ui/dialogs");
var gesturesModule = require("ui/gestures");

var UserViewModel = require("../../shared/view-models/user-view-model");
var user = new UserViewModel({ authenticating: false });

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = user;

	// Dismiss the keyboard when the user taps outside textfield
	var email = page.getViewById("email");
	page.observe(gesturesModule.GestureTypes.tap, function() {
		email.dismissSoftInput();
	});
};

exports.reset = function() {
	// Don't send off multiple requests at the same time
	if (user.get("authenticating")) {
		return;
	}

	if (user.isValidEmail()) {
		user.set("authenticating", true);
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
			.then(function() {
				user.set("authenticating", false);
			});
	} else {
		dialogsModule.alert({
			message: "Enter a valid email address.",
			okButtonText: "OK"
		});
	}
};
