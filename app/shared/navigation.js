var config = require("./config");
var frameModule = require("ui/frame");

module.exports = {
	goToLoginPage: function() {
		frameModule.topmost().navigate("views/login/login");
	},
	goToPasswordPage: function() {
		frameModule.topmost().navigate("views/password/password");
	},
	goToListPage: function() {
		frameModule.topmost().navigate({
			moduleName: "views/list/list",
			// Workaround for https://github.com/NativeScript/NativeScript/issues/1569
			clearHistory: !!frameModule.topmost().ios
		});
	},
	signOut: function() {
		config.invalidateToken();
		frameModule.topmost().navigate({
			moduleName: "views/login/login",
			animated: false,
			// Workaround for https://github.com/NativeScript/NativeScript/issues/1569
			clearHistory: !!frameModule.topmost().ios
		});
	},
	startingPage: function() {
		return config.token ? "views/list/list" : "views/login/login";
	}
};
