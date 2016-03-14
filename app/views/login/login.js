var animationModule = require("ui/animation");
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

	// Add letter spacing
	var mainLabel = page.getViewById("main-label");
	if (mainLabel.android) {
		mainLabel.android.setLetterSpacing(0.3);
	}

	// Start defining animations
	var definitions = [];

	// Parallax background
	var background = page.getViewById("background");
	definitions.push({ target: background, scale: { x: 1, y: 1 }, duration: 8000 });

	// Pear
	// definitions.push({ target: pear, opacity: 1, delay: 500, duration: 500 });
	// definitions.push({ target: pear, rotate: 360, delay: 750, duration: 2000 });

	// Apple
	// definitions.push({ target: apple, opacity: 1, delay: 1000, duration: 1000 });
	// definitions.push({ target: apple, rotate: 360, delay: 750, duration: 2000 });

	// Banana
	// definitions.push({ target: banana, opacity: 1, delay: 1000, duration: 500 });
	// definitions.push({ target: banana, scale: { x: 1.6, y: 1.6 }, delay: 1500, duration: 500 });
	// definitions.push({ target: banana, scale: { x: 1, y: 1 }, delay: 2000, duration: 500 });
	// definitions.push({ target: banana, scale: { x: 1.6, y: 1.6 }, delay: 2500, duration: 500 });
	// definitions.push({ target: banana, scale: { x: 1, y: 1 }, delay: 3000, duration: 500 });

	new animationModule.Animation(definitions, false)
		.play()
		.catch(function (e) {
			console.log(e.message);
		});
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
