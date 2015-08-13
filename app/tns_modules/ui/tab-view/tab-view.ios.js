var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/tab-view/tab-view-common");
var utilsModule = require("utils/utils");
var trace = require("trace");
var utils = require("utils/utils");
var view = require("ui/core/view");
var imageSource = require("image-source");
var types = require("utils/types");
require("utils/module-merge").merge(common, exports);
var UITabBarControllerImpl = (function (_super) {
    __extends(UITabBarControllerImpl, _super);
    function UITabBarControllerImpl() {
        _super.apply(this, arguments);
    }
    UITabBarControllerImpl.new = function () {
        return _super.new.call(this);
    };
    UITabBarControllerImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    UITabBarControllerImpl.prototype.viewDidLayoutSubviews = function () {
        trace.write("TabView.UITabBarControllerClass.viewDidLayoutSubviews();", trace.categories.Debug);
        _super.prototype.viewDidLayoutSubviews.call(this);
        if (this._owner.isLoaded) {
            this._owner._updateLayout();
        }
    };
    return UITabBarControllerImpl;
})(UITabBarController);
var UITabBarControllerDelegateImpl = (function (_super) {
    __extends(UITabBarControllerDelegateImpl, _super);
    function UITabBarControllerDelegateImpl() {
        _super.apply(this, arguments);
    }
    UITabBarControllerDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    UITabBarControllerDelegateImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    UITabBarControllerDelegateImpl.prototype.tabBarControllerDidSelectViewController = function (tabBarController, viewController) {
        trace.write("TabView.UITabBarControllerDelegateClass.tabBarControllerDidSelectViewController(" + tabBarController + ", " + viewController + ");", trace.categories.Debug);
        this._owner._onViewControllerShown(viewController);
    };
    UITabBarControllerDelegateImpl.ObjCProtocols = [UITabBarControllerDelegate];
    return UITabBarControllerDelegateImpl;
})(NSObject);
var UINavigationControllerDelegateImpl = (function (_super) {
    __extends(UINavigationControllerDelegateImpl, _super);
    function UINavigationControllerDelegateImpl() {
        _super.apply(this, arguments);
    }
    UINavigationControllerDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    UINavigationControllerDelegateImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    UINavigationControllerDelegateImpl.prototype.navigationControllerDidShowViewControllerAnimated = function (navigationController, viewController, animated) {
        trace.write("TabView.UINavigationControllerDelegateClass.navigationControllerDidShowViewControllerAnimated(" + navigationController + ", " + viewController + ", " + animated + ");", trace.categories.Debug);
        navigationController.navigationBar.topItem.rightBarButtonItem = null;
        this._owner._onViewControllerShown(viewController);
    };
    UINavigationControllerDelegateImpl.ObjCProtocols = [UINavigationControllerDelegate];
    return UINavigationControllerDelegateImpl;
})(NSObject);
var TabView = (function (_super) {
    __extends(TabView, _super);
    function TabView() {
        _super.call(this);
        this._tabBarHeight = 0;
        this._navBarHeight = 0;
        this._iconsCache = {};
        this._ios = UITabBarControllerImpl.new().initWithOwner(this);
        this._delegate = UITabBarControllerDelegateImpl.new().initWithOwner(this);
        this._moreNavigationControllerDelegate = UINavigationControllerDelegateImpl.new().initWithOwner(this);
    }
    TabView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._ios.delegate = this._delegate;
    };
    TabView.prototype.onUnloaded = function () {
        this._ios.delegate = null;
        this._ios.moreNavigationController.delegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(TabView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, "_nativeView", {
        get: function () {
            return this._ios.view;
        },
        enumerable: true,
        configurable: true
    });
    TabView.prototype._onViewControllerShown = function (viewController) {
        trace.write("TabView._onViewControllerShown(" + viewController + ");", trace.categories.Debug);
        if (this._ios.viewControllers.containsObject(viewController)) {
            this.selectedIndex = this._ios.viewControllers.indexOfObject(viewController);
            ;
        }
        else {
            trace.write("TabView._onViewControllerShown: viewController is not one of our viewControllers", trace.categories.Debug);
        }
    };
    TabView.prototype._removeTabs = function (oldItems) {
        trace.write("TabView._removeTabs(" + oldItems + ");", trace.categories.Debug);
        _super.prototype._removeTabs.call(this, oldItems);
        var i;
        var length = oldItems.length;
        var oldItem;
        for (i = 0; i < length; i++) {
            oldItem = oldItems[i];
            this._removeView(oldItem.view);
        }
        this._ios.viewControllers = null;
    };
    TabView.prototype._addTabs = function (newItems) {
        trace.write("TabView._addTabs(" + newItems + ");", trace.categories.Debug);
        _super.prototype._addTabs.call(this, newItems);
        var i;
        var length = newItems.length;
        var item;
        var newControllers = NSMutableArray.alloc().initWithCapacity(length);
        var newController;
        for (i = 0; i < length; i++) {
            item = newItems[i];
            this._addView(item.view);
            if (item.view.ios instanceof UIViewController) {
                newController = item.view.ios;
            }
            else {
                newController = new UIViewController();
                newController.view.addSubview(item.view.ios);
            }
            var icon = this._getIcon(item.iconSource);
            newController.tabBarItem = UITabBarItem.alloc().initWithTitleImageTag(item.title, icon, i);
            if (!icon) {
                newController.tabBarItem.setTitlePositionAdjustment({ horizontal: 0, vertical: -20 });
            }
            newControllers.addObject(newController);
        }
        this._ios.viewControllers = newControllers;
        this._ios.customizableViewControllers = null;
        this._ios.moreNavigationController.delegate = this._moreNavigationControllerDelegate;
    };
    TabView.prototype._getIcon = function (iconSource) {
        if (!iconSource) {
            return null;
        }
        var image;
        image = this._iconsCache[iconSource];
        if (!image) {
            var is = imageSource.fromFileOrResource(iconSource);
            if (is && is.ios) {
                is.ios.renderingMode = UIImageRenderingMode.UIImageRenderingModeAlwaysOriginal;
                this._iconsCache[iconSource] = is.ios;
                image = is.ios;
            }
        }
        return image;
    };
    TabView.prototype._onSelectedIndexPropertyChangedSetNativeValue = function (data) {
        _super.prototype._onSelectedIndexPropertyChangedSetNativeValue.call(this, data);
        var newIndex = data.newValue;
        trace.write("TabView._onSelectedIndexPropertyChangedSetNativeValue(" + newIndex + ")", trace.categories.Debug);
        if (types.isNullOrUndefined(newIndex)) {
            return;
        }
        this._ios.selectedIndex = data.newValue;
        this.requestLayout();
        var args = { eventName: TabView.selectedIndexChangedEvent, object: this, oldIndex: data.oldValue, newIndex: data.newValue };
        this.notify(args);
    };
    TabView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var nativeView = this._nativeView;
        if (nativeView) {
            var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
            var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
            var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
            var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
            this._tabBarHeight = utilsModule.ios.getActualHeight(this._ios.tabBar);
            this._navBarHeight = utilsModule.ios.getActualHeight(this._ios.moreNavigationController.navigationBar);
            var density = utils.layout.getDisplayDensity();
            var measureWidth = 0;
            var measureHeight = 0;
            var child = this._selectedView;
            if (child) {
                var childHeightMeasureSpec = utils.layout.makeMeasureSpec(height - (this._navBarHeight + this._tabBarHeight), heightMode);
                var childSize = view.View.measureChild(this, child, widthMeasureSpec, childHeightMeasureSpec);
                measureHeight = childSize.measuredHeight;
                measureWidth = childSize.measuredWidth;
            }
            measureWidth = Math.max(measureWidth, this.minWidth * density);
            measureHeight = Math.max(measureHeight, this.minHeight * density);
            var widthAndState = view.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
            var heightAndState = view.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
            this.setMeasuredDimension(widthAndState, heightAndState);
        }
    };
    TabView.prototype.onLayout = function (left, top, right, bottom) {
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        var child = this._selectedView;
        if (child) {
            view.View.layoutChild(this, child, 0, this._navBarHeight, right, (bottom - this._navBarHeight - this._tabBarHeight));
        }
    };
    return TabView;
})(common.TabView);
exports.TabView = TabView;
