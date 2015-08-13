global.moduleMerge = function (sourceExports, destExports) {
    for (var key in sourceExports) {
        destExports[key] = sourceExports[key];
    }
};
var types = require("utils/types");
var timer = require("timer");
var consoleModule = require("console");
var xhr = require("xhr/xhr");
var dialogs = require("ui/dialogs");
global.setTimeout = timer.setTimeout;
global.clearTimeout = timer.clearTimeout;
global.setInterval = timer.setInterval;
global.clearInterval = timer.clearInterval;
if (typeof global.__decorate !== "function") {
    global.__decorate = function (decorators, target, key, desc) {
        if (typeof global.Reflect === "object" && typeof global.Reflect.decorate === "function") {
            return global.Reflect.decorate(decorators, target, key, desc);
        }
        switch (arguments.length) {
            case 2: return decorators.reduceRight(function (o, d) { return (d && d(o)) || o; }, target);
            case 3: return decorators.reduceRight(function (o, d) { return (d && d(target, key)), void 0; }, void 0);
            case 4: return decorators.reduceRight(function (o, d) { return (d && d(target, key, o)) || o; }, desc);
        }
    };
}
;
if (types.isUndefined(global.NSObject)) {
    global.console = new consoleModule.Console();
}
global.XMLHttpRequest = xhr.XMLHttpRequest;
global.FormData = xhr.FormData;
global.alert = dialogs.alert;
var fetchModule = require("fetch");
global.moduleMerge(fetchModule, global);
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
