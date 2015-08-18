var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");
var pages = require("ui/page");
var types = require("utils/types");
var trace = require("trace");
var builder = require("ui/builder");
var fs = require("file-system");
var utils = require("utils/utils");
var platform = require("platform");
var fileResolverModule = require("file-system/file-name-resolver");
var frameStack = [];
function buildEntryFromArgs(arg) {
    var entry;
    if (arg instanceof pages.Page) {
        throw new Error("Navigating to a Page instance is no longer supported. Please navigate by using either a module name or a page factory function.");
    }
    else if (types.isString(arg)) {
        entry = {
            moduleName: arg
        };
    }
    else if (types.isFunction(arg)) {
        entry = {
            create: arg
        };
    }
    else {
        entry = arg;
    }
    return entry;
}
function resolvePageFromEntry(entry) {
    var page;
    if (entry.create) {
        page = entry.create();
        if (!(page && page instanceof pages.Page)) {
            throw new Error("Failed to create Page with entry.create() function.");
        }
    }
    else if (entry.moduleName) {
        var currentAppPath = fs.knownFolders.currentApp().path;
        var moduleNamePath = fs.path.join(currentAppPath, entry.moduleName);
        var moduleExports;
        var moduleExportsResolvedPath = resolveFilePath(moduleNamePath, "js");
        if (moduleExportsResolvedPath) {
            trace.write("Loading JS file: " + moduleExportsResolvedPath, trace.categories.Navigation);
            moduleExportsResolvedPath = moduleExportsResolvedPath.substr(0, moduleExportsResolvedPath.length - 3);
            moduleExports = require(moduleExportsResolvedPath);
        }
        if (moduleExports && moduleExports.createPage) {
            trace.write("Calling createPage()", trace.categories.Navigation);
            page = moduleExports.createPage();
        }
        else {
            page = pageFromBuilder(moduleNamePath, moduleExports);
        }
        if (!(page && page instanceof pages.Page)) {
            throw new Error("Failed to load Page from entry.moduleName: " + entry.moduleName);
        }
    }
    return page;
}
exports.resolvePageFromEntry = resolvePageFromEntry;
var fileNameResolver;
function resolveFilePath(path, ext) {
    if (!fileNameResolver) {
        fileNameResolver = new fileResolverModule.FileNameResolver({
            width: platform.screen.mainScreen.widthDIPs,
            height: platform.screen.mainScreen.heightDIPs,
            os: platform.device.os,
            deviceType: platform.device.deviceType
        });
    }
    return fileNameResolver.resolveFileName(path, ext);
}
function pageFromBuilder(moduleNamePath, moduleExports) {
    var page;
    var element;
    var fileName = resolveFilePath(moduleNamePath, "xml");
    if (fileName) {
        trace.write("Loading XML file: " + fileName, trace.categories.Navigation);
        element = builder.load(fileName, moduleExports);
        if (element instanceof pages.Page) {
            page = element;
            var cssFileName = resolveFilePath(moduleNamePath, "css");
            if (cssFileName) {
                page.addCssFile(cssFileName);
            }
        }
    }
    return page;
}
var Frame = (function (_super) {
    __extends(Frame, _super);
    function Frame() {
        _super.call(this);
        this._isInFrameStack = false;
        this._backStack = new Array();
        this._navigationQueue = new Array();
    }
    Frame.prototype.canGoBack = function () {
        return this._backStack.length > 0;
    };
    Frame.prototype.goBack = function () {
        trace.write(this._getTraceId() + ".goBack();", trace.categories.Navigation);
        if (!this.canGoBack()) {
            return;
        }
        var backstackEntry = this._backStack.pop();
        var navigationContext = {
            entry: backstackEntry,
            isBackNavigation: true
        };
        this._navigationQueue.push(navigationContext);
        if (this._navigationQueue.length === 1) {
            this._processNavigationContext(navigationContext);
        }
        else {
            trace.write(this._getTraceId() + ".goBack scheduled;", trace.categories.Navigation);
        }
    };
    Frame.prototype.navigate = function (param) {
        trace.write(this._getTraceId() + ".navigate();", trace.categories.Navigation);
        var entry = buildEntryFromArgs(param);
        var page = resolvePageFromEntry(entry);
        this._pushInFrameStack();
        var backstackEntry = {
            entry: entry,
            resolvedPage: page,
        };
        var navigationContext = {
            entry: backstackEntry,
            isBackNavigation: false
        };
        this._navigationQueue.push(navigationContext);
        if (this._navigationQueue.length === 1) {
            this._processNavigationContext(navigationContext);
        }
        else {
            trace.write(this._getTraceId() + ".navigation scheduled;", trace.categories.Navigation);
        }
    };
    Frame.prototype._processNavigationQueue = function (page) {
        if (this._navigationQueue.length === 0) {
            return;
        }
        var entry = this._navigationQueue[0].entry;
        var currentNavigationPage = entry.resolvedPage;
        if (page !== currentNavigationPage) {
            throw new Error("Corrupted navigation stack.");
        }
        this._navigationQueue.shift();
        if (this._navigationQueue.length > 0) {
            var navigationContext = this._navigationQueue[0];
            this._processNavigationContext(navigationContext);
        }
    };
    Frame.prototype._processNavigationContext = function (navigationContext) {
        if (navigationContext.isBackNavigation) {
            this.performGoBack(navigationContext);
        }
        else {
            this.performNavigation(navigationContext);
        }
    };
    Frame.prototype.performNavigation = function (navigationContext) {
        var navContext = navigationContext.entry;
        this._onNavigatingTo(navContext);
        if (this.currentPage) {
            this._backStack.push(this._currentEntry);
        }
        this._navigateCore(navContext);
        this._onNavigatedTo(navContext, false);
    };
    Frame.prototype.performGoBack = function (navigationContext) {
        var navContext = navigationContext.entry;
        this._onNavigatingTo(navContext);
        this._goBackCore(navContext);
        this._onNavigatedTo(navContext, true);
    };
    Frame.prototype._goBackCore = function (backstackEntry) {
    };
    Frame.prototype._navigateCore = function (backstackEntry) {
    };
    Frame.prototype._onNavigatingTo = function (backstackEntry) {
        if (this.currentPage) {
            this.currentPage.onNavigatingFrom();
        }
        backstackEntry.resolvedPage.onNavigatingTo(backstackEntry.entry.context);
    };
    Frame.prototype._onNavigatedTo = function (backstackEntry, isBack) {
        if (this.currentPage) {
            this.currentPage.onNavigatedFrom(isBack);
        }
    };
    Object.defineProperty(Frame.prototype, "animated", {
        get: function () {
            return this._animated;
        },
        set: function (value) {
            this._animated = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "backStack", {
        get: function () {
            return this._backStack.slice();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "currentPage", {
        get: function () {
            if (this._currentEntry) {
                return this._currentEntry.resolvedPage;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "currentEntry", {
        get: function () {
            return this._currentEntry;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype._pushInFrameStack = function () {
        if (this._isInFrameStack) {
            return;
        }
        frameStack.push(this);
        this._isInFrameStack = true;
    };
    Frame.prototype._popFromFrameStack = function () {
        if (!this._isInFrameStack) {
            return;
        }
        var top = _topmost();
        if (top !== this) {
            throw new Error("Cannot pop a Frame which is not at the top of the navigation stack.");
        }
        frameStack.pop();
        this._isInFrameStack = false;
    };
    Object.defineProperty(Frame.prototype, "_childrenCount", {
        get: function () {
            if (this.currentPage) {
                return 1;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype._eachChildView = function (callback) {
        if (this.currentPage) {
            callback(this.currentPage);
        }
    };
    Frame.prototype._getIsAnimatedNavigation = function (entry) {
        if (entry && types.isDefined(entry.animated)) {
            return entry.animated;
        }
        if (types.isDefined(this.animated)) {
            return this.animated;
        }
        return Frame.defaultAnimatedNavigation;
    };
    Frame.prototype._getTraceId = function () {
        return "Frame<" + this._domId + ">";
    };
    Object.defineProperty(Frame.prototype, "navigationBarHeight", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var result = view.View.measureChild(this, this.currentPage, widthMeasureSpec, utils.layout.makeMeasureSpec(height - this.navigationBarHeight, heightMode));
        var widthAndState = view.View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Frame.prototype.onLayout = function (left, top, right, bottom) {
        view.View.layoutChild(this, this.currentPage, 0, this.navigationBarHeight, right - left, bottom - top);
    };
    Frame.prototype._addViewToNativeVisualTree = function (child) {
        return true;
    };
    Frame.prototype._removeViewFromNativeVisualTree = function (child) {
        child._isAddedToNativeVisualTree = false;
    };
    Frame.androidOptionSelectedEvent = "optionSelected";
    Frame.defaultAnimatedNavigation = true;
    return Frame;
})(view.CustomLayoutView);
exports.Frame = Frame;
var _topmost = function () {
    if (frameStack.length > 0) {
        return frameStack[frameStack.length - 1];
    }
    return undefined;
};
exports.topmost = _topmost;
function goBack() {
    var top = _topmost();
    if (top.canGoBack()) {
        top.goBack();
        return true;
    }
    if (frameStack.length > 1) {
        top._popFromFrameStack();
    }
    return false;
}
exports.goBack = goBack;
function stack() {
    return frameStack;
}
exports.stack = stack;
