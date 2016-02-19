var applicationModule = require("application");
var navigation = require("./shared/navigation");

applicationModule.start({
	// Workaround for https://github.com/NativeScript/NativeScript/issues/1577
	// After 1.7 always pass navigation.startingPage()
	moduleName: global.android? "views/login/login" : navigation.startingPage()
});