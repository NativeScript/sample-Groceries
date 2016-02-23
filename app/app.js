var applicationModule = require("application");
var navigation = require("./shared/navigation");

applicationModule.start({
	moduleName: navigation.startingPage()
});
