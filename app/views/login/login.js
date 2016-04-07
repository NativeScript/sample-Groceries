var Animation = require("ui/animation").Animation;
var Color = require("color").Color;
var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var platform = require("platform");

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

	handleAndroidFocus();
	addLetterSpacing();
	setHintColors();

	// Create the parallax background effect by scaling the background image
	page.getViewById("background").animate({
		scale: { x: 1.2, y: 1.2 },
		duration: 8000
	});
};

// Prevent the first textfield from receiving focus on Android
// See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
function handleAndroidFocus() {
	var container = page.getViewById("container");
	if (container.android) {
		container.android.setFocusableInTouchMode(true);
		container.android.setFocusable(true);
		email.android.clearFocus();
	}
}

// TODO: Replace with letter-spacing in CSS when {N} 2.0 is out.
function addLetterSpacing() {
	var mainLabel = page.getViewById("main-label");
	var initialLabel = page.getViewById("initial-label");
	var androidLetterSpacing = 0.2;

	if (mainLabel.android && platform.device.sdkVersion >= "21") {
		mainLabel.android.setLetterSpacing(androidLetterSpacing);
		initialLabel.android.setLetterSpacing(androidLetterSpacing);
	}
	if (mainLabel.ios) {
		var text = mainLabel.ios.text;
		var attributedString = NSMutableAttributedString.alloc().initWithString(text);
		attributedString.addAttributeValueRange(NSKernAttributeName, 5.0, NSMakeRange(0, text.length));
		mainLabel.ios.attributedText = attributedString;
		initialLabel.ios.attributedText = attributedString;
	}
}

function setHintColors() {
	var placeHolderColor = pageData.get("isLogin") ? "#ACA6A7" : "#C4AFB4";

	if (email.android) {
		var color = android.graphics.Color.parseColor(placeHolderColor);
		email.android.setHintTextColor(color);
		password.android.setHintTextColor(color);
	}
	if (email.ios) {
		var dictionary = new NSDictionary([new Color(placeHolderColor).ios], [NSForegroundColorAttributeName]);
		email.ios.attributedPlaceholder = NSAttributedString.alloc().initWithStringAttributes(
			email.hint, dictionary);
		password.ios.attributedPlaceholder = NSAttributedString.alloc().initWithStringAttributes(
			password.hint, dictionary);
	}
}

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
	pageData.set("isLogin", isLogin);

	setHintColors();

	// Animate the background color of the main container
	var container = page.getViewById("container");
	container.animate({
		backgroundColor: isLogin ? new Color("white") : new Color("#301217"),
		duration: 200
	});

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

exports.showMainContent = function() {
	var initialContainer = page.getViewById("initial-container");
	var mainContainer = page.getViewById("container");
	var containerLogo = page.getViewById("container-logo");
	var formControls = page.getViewById("form-controls");
	var signUpStack = page.getViewById("sign-up-stack");
	var animations = [];

	// Fade out the initial content over one half second.
	initialContainer.animate({
		opacity: 0,
		duration: 500
	}).then(function() {
		// After the animation completes, hide the initial container and
		// show the main container and logo. The main container and logo will
		// not immediately appear because their opacity is set to 0 in CSS.
		initialContainer.style.visibility = "collapsed";
		mainContainer.style.visibility = "visible";
		containerLogo.style.visibility = "visible";

		// Fade in the main container and logo over one half second.
		animations.push({ target: mainContainer, opacity: 1, duration: 500 });
		animations.push({ target: containerLogo, opacity: 1, duration: 500 });

		// Slide up the form controls and sign up container.
		animations.push({ target: signUpStack, translate: { x: 0, y: 0 }, opacity: 1, delay: 500, duration: 150 });
		animations.push({ target: formControls, translate: { x: 0, y: 0 }, opacity: 1, delay: 650, duration: 150 });

		// Kick off the animation queue
		new Animation(animations, false).play();
	});
};
