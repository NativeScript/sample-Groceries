var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var contentView = require("ui/content-view");
var view = require("ui/core/view");
var styleScope = require("ui/styling/style-scope");
var fs = require("file-system");
var fileSystemAccess = require("file-system/file-system-access");
var frameCommon = require("ui/frame/frame-common");
var actionBar = require("ui/action-bar");
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var actionBarHiddenProperty = new dependencyObservable.Property("actionBarHidden", "Page", new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout));
function onActionBarHiddenPropertyChanged(data) {
    var page = data.object;
    if (page.isLoaded) {
        page._updateActionBar(data.newValue);
    }
}
actionBarHiddenProperty.metadata.onSetNativeValue = onActionBarHiddenPropertyChanged;
var Page = (function (_super) {
    __extends(Page, _super);
    function Page(options) {
        _super.call(this, options);
        this._styleScope = new styleScope.StyleScope();
        this._cssFiles = {};
        this.actionBar = new actionBar.ActionBar();
    }
    Page.prototype.onLoaded = function () {
        this._applyCss();
        if (this.actionBarHidden !== undefined) {
            this._updateActionBar(this.actionBarHidden);
        }
        _super.prototype.onLoaded.call(this);
    };
    Object.defineProperty(Page.prototype, "actionBarHidden", {
        get: function () {
            return this._getValue(Page.actionBarHiddenProperty);
        },
        set: function (value) {
            this._setValue(Page.actionBarHiddenProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Page.prototype._updateActionBar = function (hidden) {
    };
    Object.defineProperty(Page.prototype, "navigationContext", {
        get: function () {
            return this._navigationContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "css", {
        get: function () {
            if (this._styleScope) {
                return this._styleScope.css;
            }
            return undefined;
        },
        set: function (value) {
            this._styleScope.css = value;
            this._refreshCss();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Page.prototype, "actionBar", {
        get: function () {
            return this._actionBar;
        },
        set: function (value) {
            if (!value) {
                throw new Error("ActionBar cannot be null or undefined.");
            }
            if (this._actionBar !== value) {
                if (this._actionBar) {
                    this._actionBar.page = undefined;
                    this._removeView(this._actionBar);
                }
                this._actionBar = value;
                this._actionBar.page = this;
                this._addView(this._actionBar);
            }
        },
        enumerable: true,
        configurable: true
    });
    Page.prototype._refreshCss = function () {
        if (this._cssApplied) {
            this._resetCssValues();
        }
        this._cssApplied = false;
        if (this.isLoaded) {
            this._applyCss();
        }
    };
    Page.prototype.addCss = function (cssString) {
        this._addCssInternal(cssString, undefined);
    };
    Page.prototype._addCssInternal = function (cssString, cssFileName) {
        this._styleScope.addCss(cssString, cssFileName);
        this._refreshCss();
    };
    Page.prototype.addCssFile = function (cssFileName) {
        var _this = this;
        if (cssFileName.indexOf("~/") === 0) {
            cssFileName = fs.path.join(fs.knownFolders.currentApp().path, cssFileName.replace("~/", ""));
        }
        if (!this._cssFiles[cssFileName]) {
            if (fs.File.exists(cssFileName)) {
                new fileSystemAccess.FileSystemAccess().readText(cssFileName, function (r) {
                    _this._addCssInternal(r, cssFileName);
                    _this._cssFiles[cssFileName] = true;
                });
            }
        }
    };
    Object.defineProperty(Page.prototype, "frame", {
        get: function () {
            return this.parent;
        },
        enumerable: true,
        configurable: true
    });
    Page.prototype.onNavigatingTo = function (context) {
        this._navigationContext = context;
        this.notify({
            eventName: Page.navigatingToEvent,
            object: this,
            context: this.navigationContext
        });
    };
    Page.prototype.onNavigatedTo = function () {
        this.notify({
            eventName: Page.navigatedToEvent,
            object: this,
            context: this.navigationContext
        });
    };
    Page.prototype.onNavigatingFrom = function () {
        this.notify({
            eventName: Page.navigatingFromEvent,
            object: this,
            context: this.navigationContext
        });
    };
    Page.prototype.onNavigatedFrom = function (isBackNavigation) {
        this.notify({
            eventName: Page.navigatedFromEvent,
            object: this,
            context: this.navigationContext
        });
        this._navigationContext = undefined;
    };
    Page.prototype.showModal = function (moduleName, context, closeCallback, fullscreen) {
        var page = frameCommon.resolvePageFromEntry({ moduleName: moduleName });
        page._showNativeModalView(this, context, closeCallback, fullscreen);
    };
    Page.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof actionBar.ActionBar) {
            this.actionBar = value;
        }
        else {
            _super.prototype._addChildFromBuilder.call(this, name, value);
        }
    };
    Page.prototype._showNativeModalView = function (parent, context, closeCallback, fullscreen) {
    };
    Page.prototype._hideNativeModalView = function (parent) {
    };
    Page.prototype._raiseShownModallyEvent = function (parent, context, closeCallback) {
        var that = this;
        var closeProxy = function () {
            that._hideNativeModalView(parent);
            closeCallback.apply(undefined, arguments);
        };
        this.notify({
            eventName: Page.shownModallyEvent,
            object: this,
            context: context,
            closeCallback: closeProxy
        });
    };
    Page.prototype._getStyleScope = function () {
        return this._styleScope;
    };
    Page.prototype._eachChildView = function (callback) {
        _super.prototype._eachChildView.call(this, callback);
        callback(this.actionBar);
    };
    Page.prototype._applyCss = function () {
        if (this._cssApplied) {
            return;
        }
        this._styleScope.ensureSelectors();
        var scope = this._styleScope;
        var checkSelectors = function (view) {
            scope.applySelectors(view);
            return true;
        };
        checkSelectors(this);
        view.eachDescendant(this, checkSelectors);
        this._cssApplied = true;
    };
    Page.prototype._resetCssValues = function () {
        var resetCssValuesFunc = function (view) {
            view.style._resetCssValues();
            return true;
        };
        resetCssValuesFunc(this);
        view.eachDescendant(this, resetCssValuesFunc);
    };
    Page.prototype._addViewToNativeVisualTree = function (view) {
        if (view === this.actionBar) {
            return true;
        }
        return _super.prototype._addViewToNativeVisualTree.call(this, view);
    };
    Page.actionBarHiddenProperty = actionBarHiddenProperty;
    Page.navigatingToEvent = "navigatingTo";
    Page.navigatedToEvent = "navigatedTo";
    Page.navigatingFromEvent = "navigatingFrom";
    Page.navigatedFromEvent = "navigatedFrom";
    Page.shownModallyEvent = "shownModally";
    return Page;
})(contentView.ContentView);
exports.Page = Page;
