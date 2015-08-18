var types = require("utils/types");
var timer = require("timer");
var consoleModule = require("console");
var http = require("http");
var dialogs = require("ui/dialogs");
global.setTimeout = timer.setTimeout;
global.clearTimeout = timer.clearTimeout;
global.setInterval = timer.setInterval;
global.clearInterval = timer.clearInterval;
if (types.isUndefined(global.NSObject)) {
    global.console = new consoleModule.Console();
}
global.XMLHttpRequest = http.XMLHttpRequest;
global.alert = dialogs.alert;
function Deprecated(target, key, descriptor) {
    if (descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            console.log(key + " is deprecated");
            return originalMethod.apply(this, args);
        };
        return descriptor;
    }
    else {
        console.log((target && target.name || target) + " is deprecated");
        return target;
    }
}
exports.Deprecated = Deprecated;
global.Deprecated = Deprecated;
