var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var gesturesModule = require("ui/gestures");

var UserViewModel = require("../../shared/view-models/user-view-model");
var user = new UserViewModel({ authenticating: false });

exports.loaded = function(args) {
	var page = args.object;
	page.bindingContext = user;

	// Dismiss the keyboard when the user taps outside of the two textfields
	var email = page.getViewById("email");
	var password = page.getViewById("password");
	page.observe(gesturesModule.GestureTypes.tap, function() {
		email.dismissSoftInput();
		password.dismissSoftInput();
	});
};

function completeRegistration() {
	// Don't send off multiple requests at the same time
	if (user.get("authenticating")) {
		return;
	}

	user.set("authenticating", true);
	user.register()
		.then(function() {
			user.set("authenticating", false);
			dialogsModule
				.alert("Your account was successfully created.")
				.then(function() {
					frameModule.topmost().navigate("views/login/login");
				});
		}).catch(function() {
			user.set("authenticating", false);
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
