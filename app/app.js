var applicationModule = require("application");
var navigation = require("./shared/navigation");

applicationModule.mainModule = navigation.startingPage();
applicationModule.start();