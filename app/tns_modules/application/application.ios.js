var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var appModule = require("application/application-common");
var frame = require("ui/frame");
var utils = require("utils/utils");
var types = require("utils/types");
var definition = require("application");
require("utils/module-merge").merge(appModule, exports);
exports.mainModule;
var Window = (function (_super) {
    __extends(Window, _super);
    function Window() {
        _super.apply(this, arguments);
    }
    Window.prototype.initWithFrame = function (frame) {
        var window = _super.prototype.initWithFrame.call(this, frame);
        if (window) {
            window.autoresizingMask = UIViewAutoresizing.UIViewAutoresizingNone;
        }
        return window;
    };
    Object.defineProperty(Window.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (value) {
            this._content = value;
        },
        enumerable: true,
        configurable: true
    });
    Window.prototype.layoutSubviews = function () {
        utils.ios._layoutRootView(this._content, UIScreen.mainScreen().bounds);
    };
    return Window;
})(UIWindow);
var TNSAppDelegate = (function (_super) {
    __extends(TNSAppDelegate, _super);
    function TNSAppDelegate() {
        _super.apply(this, arguments);
    }
    TNSAppDelegate.prototype.applicationDidFinishLaunchingWithOptions = function (application, launchOptions) {
        this.window = Window.alloc().initWithFrame(UIScreen.mainScreen().bounds);
        this.window.backgroundColor = UIColor.whiteColor();
        if (exports.onLaunch) {
            exports.onLaunch();
        }
        exports.notify({ eventName: definition.launchEvent, object: this, ios: launchOptions });
        var topFrame = frame.topmost();
        if (!topFrame) {
            if (exports.mainModule) {
                topFrame = new frame.Frame();
                topFrame.navigate(exports.mainModule);
            }
            else {
                return;
            }
        }
        this.window.content = topFrame;
        this.window.rootViewController = topFrame.ios.controller;
        var app = exports.ios;
        app.rootController = this.window.rootViewController;
        this.window.makeKeyAndVisible();
        return true;
    };
    TNSAppDelegate.prototype.applicationDidBecomeActive = function (application) {
        if (exports.onResume) {
            exports.onResume();
        }
        exports.notify({ eventName: definition.resumeEvent, object: this, ios: application });
    };
    TNSAppDelegate.prototype.applicationWillResignActive = function (application) {
    };
    TNSAppDelegate.prototype.applicationDidEnterBackground = function (application) {
        if (exports.onSuspend) {
            exports.onSuspend();
        }
        exports.notify({ eventName: definition.suspendEvent, object: this, ios: application });
    };
    TNSAppDelegate.prototype.applicationWillEnterForeground = function (application) {
    };
    TNSAppDelegate.prototype.applicationWillTerminate = function (application) {
        if (exports.onExit) {
            exports.onExit();
        }
        exports.notify({ eventName: definition.exitEvent, object: this, ios: application });
    };
    TNSAppDelegate.prototype.applicationDidReceiveMemoryWarning = function (application) {
        if (exports.onLowMemory) {
            exports.onLowMemory();
        }
        exports.notify({ eventName: definition.lowMemoryEvent, object: this, android: undefined, ios: application });
    };
    TNSAppDelegate.prototype.applicationOpenURLSourceApplicationAnnotation = function (application, url, sourceApplication, annotation) {
        var dictionary = new NSMutableDictionary();
        dictionary.setObjectForKey(url, "TLKApplicationOpenURL");
        dictionary.setObjectForKey(application, "TLKApplication");
        NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo("com.telerik.TLKApplicationOpenURL", null, dictionary);
        return true;
    };
    TNSAppDelegate.ObjCProtocols = [UIApplicationDelegate];
    return TNSAppDelegate;
})(UIResponder);
var IOSApplication = (function () {
    function IOSApplication() {
        this.nativeApp = UIApplication.sharedApplication();
    }
    IOSApplication.prototype.init = function () {
        this._tnsAppdelegate = new TNSAppDelegate();
    };
    return IOSApplication;
})();
var app = new IOSApplication();
exports.ios = app;
app.init();
exports.start = function () {
    appModule.loadCss();
    try {
        UIApplicationMain(0, null, null, "TNSAppDelegate");
    }
    catch (error) {
        if (!types.isFunction(exports.onUncaughtError)) {
            return;
        }
        exports.onUncaughtError(error);
        definition.notify({ eventName: definition.uncaughtErrorEvent, object: definition.ios, ios: error });
    }
};
