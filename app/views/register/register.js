var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var gesturesModule = require("ui/gestures");
var viewModule = require("ui/core/view");

var UserViewModel = require("../../shared/view-models/user-view-model");
var user = new UserViewModel();

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = user;

	// Dismiss the keyboard when the user taps outside of the two textfields
	var email = viewModule.getViewById(page, "email");
	var password = viewModule.getViewById(page, "password");
	page.observe(gesturesModule.GestureTypes.tap, function() {
		email.dismissSoftInput();
		password.dismissSoftInput();
	});
};

function completeRegistration() {
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
		});
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
