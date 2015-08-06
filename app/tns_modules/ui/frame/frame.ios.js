var frameCommon = require("ui/frame/frame-common");
var trace = require("trace");
var enums = require("ui/enums");
var utils = require("utils/utils");
var view = require("ui/core/view");
var types = require("utils/types");
global.moduleMerge(frameCommon, exports);
var ENTRY = "_entry";
var navDepth = 0;
var Frame = (function (_super) {
    __extends(Frame, _super);
    function Frame() {
        _super.call(this);
        this._shouldSkipNativePop = false;
        this._ios = new iOSFrame(this);
    }
    Frame.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this._paramToNavigate) {
            this.navigate(this._paramToNavigate);
            this._paramToNavigate = undefined;
        }
    };
    Frame.prototype.navigate = function (param) {
        if (this.isLoaded) {
            _super.prototype.navigate.call(this, param);
        }
        else {
            this._paramToNavigate = param;
        }
    };
    Frame.prototype._navigateCore = function (backstackEntry) {
        var viewController = backstackEntry.resolvedPage.ios;
        if (!viewController) {
            throw new Error("Required page does have an viewController created.");
        }
        var animated = false;
        if (this.currentPage) {
            animated = this._getIsAnimatedNavigation(backstackEntry.entry);
        }
        this.updateNavigationBar();
        viewController[ENTRY] = backstackEntry;
        navDepth++;
        trace.write("Frame<" + this._domId + ">.pushViewControllerAnimated depth = " + navDepth, trace.categories.Navigation);
        this._ios.controller.pushViewControllerAnimated(viewController, animated);
    };
    Frame.prototype._goBackCore = function (entry) {
        navDepth--;
        trace.write("Frame<" + this._domId + ">.popViewControllerAnimated depth = " + navDepth, trace.categories.Navigation);
        if (!this._shouldSkipNativePop) {
            this._ios.controller.popViewControllerAnimated(this._getIsAnimatedNavigation(entry));
        }
    };
    Frame.prototype.updateNavigationBar = function (page) {
        var previousValue = !!this._ios.showNavigationBar;
        var newValue = false;
        switch (this._ios.navBarVisibility) {
            case enums.NavigationBarVisibility.always:
                newValue = true;
                break;
            case enums.NavigationBarVisibility.never:
                newValue = false;
                break;
            case enums.NavigationBarVisibility.auto:
                var pageInstance = page || this.currentPage;
                if (pageInstance && types.isDefined(pageInstance.actionBarHidden)) {
                    newValue = !pageInstance.actionBarHidden;
                }
                else {
                    newValue = this.backStack.length > 0 || (pageInstance && !pageInstance.actionBar._isEmpty());
                }
                newValue = !!newValue;
                break;
        }
        this._ios.showNavigationBar = newValue;
        if (previousValue !== newValue) {
            this.requestLayout();
        }
    };
    Object.defineProperty(Frame.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "_nativeView", {
        get: function () {
            return this._ios.controller.view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame, "defaultAnimatedNavigation", {
        get: function () {
            return frameCommon.Frame.defaultAnimatedNavigation;
        },
        set: function (value) {
            frameCommon.Frame.defaultAnimatedNavigation = value;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype.requestLayout = function () {
        _super.prototype.requestLayout.call(this);
        var window = this._nativeView.window;
        if (window) {
            window.setNeedsLayout();
        }
    };
    Frame.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var result = view.View.measureChild(this, this.currentPage, widthMeasureSpec, utils.layout.makeMeasureSpec(height - this.navigationBarHeight, heightMode));
        if (this._navigateToEntry) {
            view.View.measureChild(this, this._navigateToEntry.resolvedPage, widthMeasureSpec, utils.layout.makeMeasureSpec(height - this.navigationBarHeight, heightMode));
        }
        var widthAndState = view.View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Frame.prototype.onLayout = function (left, top, right, bottom) {
        view.View.layoutChild(this, this.currentPage, 0, this.navigationBarHeight, right - left, bottom - top);
        if (this._navigateToEntry) {
            view.View.layoutChild(this, this._navigateToEntry.resolvedPage, 0, this.navigationBarHeight, right - left, bottom - top);
        }
    };
    Object.defineProperty(Frame.prototype, "navigationBarHeight", {
        get: function () {
            var navigationBar = this._ios.controller.navigationBar;
            return (navigationBar && !this._ios.controller.navigationBarHidden) ? navigationBar.frame.size.height : 0;
        },
        enumerable: true,
        configurable: true
    });
    return Frame;
})(frameCommon.Frame);
exports.Frame = Frame;
var UINavigationControllerImpl = (function (_super) {
    __extends(UINavigationControllerImpl, _super);
    function UINavigationControllerImpl() {
        _super.apply(this, arguments);
    }
    UINavigationControllerImpl.new = function () {
        return _super.new.call(this);
    };
    UINavigationControllerImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    UINavigationControllerImpl.prototype.viewDidLoad = function () {
        this.view.autoresizesSubviews = false;
        this.view.autoresizingMask = UIViewAutoresizing.UIViewAutoresizingNone;
        this._owner.onLoaded();
    };
    UINavigationControllerImpl.prototype.viewDidLayoutSubviews = function () {
        trace.write(this._owner + " viewDidLayoutSubviews, isLoaded = " + this._owner.isLoaded, trace.categories.ViewHierarchy);
        this._owner._updateLayout();
    };
    UINavigationControllerImpl.prototype.navigationControllerWillShowViewControllerAnimated = function (navigationController, viewController, animated) {
        var frame = this._owner;
        var newEntry = viewController[ENTRY];
        var newPage = newEntry.resolvedPage;
        if (!newPage.parent) {
            if (!frame._currentEntry) {
                frame._currentEntry = newEntry;
            }
            else {
                frame._navigateToEntry = newEntry;
            }
            frame._addView(newPage);
        }
        else if (newPage.parent !== frame) {
            throw new Error("Page is already shown on another frame.");
        }
        newPage.actionBar.update();
    };
    UINavigationControllerImpl.prototype.navigationControllerDidShowViewControllerAnimated = function (navigationController, viewController, animated) {
        var frame = this._owner;
        var backStack = frame.backStack;
        var currentEntry = backStack.length > 0 ? backStack[backStack.length - 1] : null;
        var newEntry = viewController[ENTRY];
        var isBack = currentEntry && newEntry === currentEntry;
        if (isBack) {
            try {
                frame._shouldSkipNativePop = true;
                frame.goBack();
            }
            finally {
                frame._shouldSkipNativePop = false;
            }
        }
        var page = frame.currentPage;
        if (page && !navigationController.viewControllers.containsObject(page.ios)) {
            frame._removeView(page);
        }
        frame._navigateToEntry = null;
        frame._currentEntry = newEntry;
        frame.updateNavigationBar();
        frame.ios.controller.navigationBar.backIndicatorImage;
        var newPage = newEntry.resolvedPage;
        newPage.onNavigatedTo();
        frame._processNavigationQueue(newPage);
    };
    UINavigationControllerImpl.prototype.supportedInterfaceOrientation = function () {
        return UIInterfaceOrientationMask.UIInterfaceOrientationMaskAll;
    };
    UINavigationControllerImpl.ObjCProtocols = [UINavigationControllerDelegate];
    return UINavigationControllerImpl;
})(UINavigationController);
var iOSFrame = (function () {
    function iOSFrame(owner) {
        this._controller = UINavigationControllerImpl.new().initWithOwner(owner);
        this._controller.delegate = this._controller;
        this._controller.automaticallyAdjustsScrollViewInsets = false;
        this.showNavigationBar = false;
        this._navBarVisibility = enums.NavigationBarVisibility.auto;
    }
    Object.defineProperty(iOSFrame.prototype, "controller", {
        get: function () {
            return this._controller;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(iOSFrame.prototype, "showNavigationBar", {
        get: function () {
            return this._showNavigationBar;
        },
        set: function (value) {
            this._showNavigationBar = value;
            this._controller.navigationBarHidden = !value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(iOSFrame.prototype, "navBarVisibility", {
        get: function () {
            return this._navBarVisibility;
        },
        set: function (value) {
            this._navBarVisibility = value;
        },
        enumerable: true,
        configurable: true
    });
    return iOSFrame;
})();
