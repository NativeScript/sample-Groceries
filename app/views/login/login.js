var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;

var statusBarUtil = require("../../shared/utils/status-bar-util");
var formUtil = require("../../shared/utils/form-util");
var navigation = require("../../shared/navigation");
var UserViewModel = require("../../shared/view-models/user-view-model");

var pageData;
var user;
var page;
var email;
var password;
var submitButton;
var container;

exports.loaded = function(args) {
	page = args.object;

	user = new UserViewModel({
		email: "nativescriptrocks@telerik.com",
		password: "password",
	});
	pageData = new Observable({
		user: user,
		authenticating: false,
		isLogin: true
	});
	page.bindingContext = pageData;
	statusBarUtil.configure();

	email = page.getViewById("email");
	password = page.getViewById("password");
	submitButton = page.getViewById("submit-button");
	formUtil.hideKeyboardOnBlur(page, [email, password]);

	// Prevent the first textfield from receiving focus on Android
	// See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
	if (page.android) {
		container = page.getViewById("container");
		container.android.setFocusableInTouchMode(true);
		container.android.setFocusable(true);
		email.android.clearFocus();
	}

	// Add a parallax effect to the background
	/* var background = page.getViewById("background");
	background.animate({ scale: { x: 1.4, y: 1.4 }, duration: 0 })
		.then(function() {
			background.animate({ scale: { x: 1, y: 1 }, duration: 8000 })
		}); */
};

exports.focusPassword = function() {
	password.focus();
};

function disableForm() {
	email.isEnabled = false;
	password.isEnabled = false;
	submitButton.isEnabled = false;
	pageData.set("authenticating", true);
}
function enableForm() {
	email.isEnabled = true;
	password.isEnabled = true;
	submitButton.isEnabled = true;
	pageData.set("authenticating", false);
}

exports.submit = function() {
	if (!user.isValidEmail()) {
		dialogsModule.alert({
			message: "Enter a valid email address.",
			okButtonText: "OK"
		});
		return;
	}

	disableForm();

	if (pageData.get("isLogin")) {
		login();
	} else {
		register();
	}
};

function login() {
	user.login()
		.catch(function() {
			dialogsModule.alert({
				message: "Unfortunately we could not find your account.",
				okButtonText: "OK"
			});
			enableForm();
			return Promise.reject();
		})
		.then(enableForm)
		.then(navigation.goToListPage);
}

function register() {
	user.register()
		.then(function() {
			dialogsModule
				.alert("Your account was successfully created.")
				.then(function() {
					pageData.set("isLogin", true);
					enableForm();
				});
		}).catch(function() {
			dialogsModule
				.alert({
					message: "Unfortunately we were unable to create your account.",
					okButtonText: "OK"
				});
		}).then(enableForm);
}

exports.forgotPassword = function() {
	if (!pageData.get("isLogin")) {
		return;
	}
	navigation.goToPasswordPage();
}

exports.toggleDisplay = function() {
	var isLogin = !pageData.get("isLogin");

	if (email.android) {
		var color = android.graphics.Color.parseColor(isLogin ? "#858585" : "#483437");
		email.android.setHintTextColor(color);
		password.android.setHintTextColor(color);
	}

	pageData.set("isLogin", isLogin);

	// Update the UIButton text without an animation.
	// See http://stackoverflow.com/questions/18946490/how-to-stop-unwanted-uibutton-animation-on-title-change#answer-22101732
	if (submitButton.ios) {
		UIView.performWithoutAnimation(function() {
			updateSubmitButtonText();
			submitButton.ios.layoutIfNeeded();
		});
	} else {
		updateSubmitButtonText();
	}
};

function updateSubmitButtonText() {
	submitButton.text = pageData.get("isLogin") ? "Login" : "Sign up";
}
