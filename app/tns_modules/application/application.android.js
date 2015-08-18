var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var appModule = require("application/application-common");
var dts = require("application");
var frame = require("ui/frame");
var types = require("utils/types");
var observable = require("data/observable");
require("utils/module-merge").merge(appModule, exports);
exports.mainModule;
var initEvents = function () {
    var androidApp = exports.android;
    var lifecycleCallbacks = new android.app.Application.ActivityLifecycleCallbacks({
        onActivityCreated: function (activity, bundle) {
            if (!androidApp.startActivity) {
                androidApp.startActivity = activity;
                androidApp.notify({ eventName: "activityCreated", object: androidApp, activity: activity, bundle: bundle });
                if (androidApp.onActivityCreated) {
                    androidApp.onActivityCreated(activity, bundle);
                }
            }
            androidApp.currentContext = activity;
        },
        onActivityDestroyed: function (activity) {
            if (activity === androidApp.foregroundActivity) {
                androidApp.foregroundActivity = undefined;
            }
            if (activity === androidApp.currentContext) {
                androidApp.currentContext = undefined;
            }
            if (activity === androidApp.startActivity) {
                if (exports.onExit) {
                    exports.onExit();
                }
                exports.notify({ eventName: dts.exitEvent, object: androidApp, android: activity });
                androidApp.startActivity = undefined;
            }
            androidApp.notify({ eventName: "activityDestroyed", object: androidApp, activity: activity });
            if (androidApp.onActivityDestroyed) {
                androidApp.onActivityDestroyed(activity);
            }
            gc();
        },
        onActivityPaused: function (activity) {
            if (activity === androidApp.foregroundActivity) {
                if (exports.onSuspend) {
                    exports.onSuspend();
                }
                exports.notify({ eventName: dts.suspendEvent, object: androidApp, android: activity });
            }
            androidApp.notify({ eventName: "activityPaused", object: androidApp, activity: activity });
            if (androidApp.onActivityPaused) {
                androidApp.onActivityPaused(activity);
            }
        },
        onActivityResumed: function (activity) {
            if (activity === androidApp.foregroundActivity) {
                if (exports.onResume) {
                    exports.onResume();
                }
                exports.notify({ eventName: dts.resumeEvent, object: androidApp, android: activity });
            }
            androidApp.notify({ eventName: "activityResumed", object: androidApp, activity: activity });
            if (androidApp.onActivityResumed) {
                androidApp.onActivityResumed(activity);
            }
        },
        onActivitySaveInstanceState: function (activity, bundle) {
            androidApp.notify({ eventName: "saveActivityState", object: androidApp, activity: activity, bundle: bundle });
            if (androidApp.onSaveActivityState) {
                androidApp.onSaveActivityState(activity, bundle);
            }
        },
        onActivityStarted: function (activity) {
            androidApp.foregroundActivity = activity;
            androidApp.notify({ eventName: "activityStarted", object: androidApp, activity: activity });
            if (androidApp.onActivityStarted) {
                androidApp.onActivityStarted(activity);
            }
        },
        onActivityStopped: function (activity) {
            androidApp.notify({ eventName: "activityStopped", object: androidApp, activity: activity });
            if (androidApp.onActivityStopped) {
                androidApp.onActivityStopped(activity);
            }
        }
    });
    return lifecycleCallbacks;
};
app.init({
    getActivity: function (activity) {
        var intent = activity.getIntent();
        return exports.android.getActivity(intent);
    },
    onCreate: function () {
        exports.android.init(this);
    }
});
var AndroidApplication = (function (_super) {
    __extends(AndroidApplication, _super);
    function AndroidApplication() {
        _super.apply(this, arguments);
    }
    AndroidApplication.prototype.getActivity = function (intent) {
        if (intent && intent.getAction() === android.content.Intent.ACTION_MAIN) {
            if (exports.onLaunch) {
                exports.onLaunch(intent);
            }
            exports.notify({ eventName: dts.launchEvent, object: this, android: intent });
        }
        var topFrame = frame.topmost();
        if (!topFrame) {
            if (exports.mainModule) {
                topFrame = new frame.Frame();
                topFrame.navigate(exports.mainModule);
            }
            else {
                throw new Error("A Frame must be used to navigate to a Page.");
            }
        }
        return topFrame.android.onActivityRequested(intent);
    };
    AndroidApplication.prototype.init = function (nativeApp) {
        this.nativeApp = nativeApp;
        this.packageName = nativeApp.getPackageName();
        this.context = nativeApp.getApplicationContext();
        this._eventsToken = initEvents();
        this.nativeApp.registerActivityLifecycleCallbacks(this._eventsToken);
        this.context = this.nativeApp.getApplicationContext();
    };
    AndroidApplication.activityCreatedEvent = "activityCreated";
    AndroidApplication.activityDestroyedEvent = "activityDestroyed";
    AndroidApplication.activityStartedEvent = "activityStarted";
    AndroidApplication.activityPausedEvent = "activityPaused";
    AndroidApplication.activityResumedEvent = "activityResumed";
    AndroidApplication.activityStoppedEvent = "activityStopped";
    AndroidApplication.saveActivityStateEvent = "saveActivityState";
    AndroidApplication.activityResultEvent = "activityResult";
    AndroidApplication.activityBackPressedEvent = "activityBackPressed";
    __decorate([
        Deprecated
    ], AndroidApplication.prototype, "onActivityCreated");
    __decorate([
        Deprecated
    ], AndroidApplication.prototype, "onActivityDestroyed");
    __decorate([
        Deprecated
    ], AndroidApplication.prototype, "onActivityStarted");
    __decorate([
        Deprecated
    ], AndroidApplication.prototype, "onActivityPaused");
    __decorate([
        Deprecated
    ], AndroidApplication.prototype, "onActivityResumed");
    __decorate([
        Deprecated
    ], AndroidApplication.prototype, "onActivityStopped");
    __decorate([
        Deprecated
    ], AndroidApplication.prototype, "onSaveActivityState");
    __decorate([
        Deprecated
    ], AndroidApplication.prototype, "onActivityResult");
    return AndroidApplication;
})(observable.Observable);
exports.AndroidApplication = AndroidApplication;
global.__onUncaughtError = function (error) {
    if (!types.isFunction(exports.onUncaughtError)) {
        return;
    }
    var nsError = {
        message: error.message,
        name: error.name,
        nativeError: error.nativeException
    };
    exports.onUncaughtError(nsError);
    exports.notify({ eventName: dts.uncaughtErrorEvent, object: appModule.android, android: nsError });
};
exports.start = function () {
    dts.loadCss();
};
exports.android = new AndroidApplication();
