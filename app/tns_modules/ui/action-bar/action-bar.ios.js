var common = require("ui/action-bar/action-bar-common");
var imageSource = require("image-source");
var frameModule = require("ui/frame");
var enums = require("ui/enums");
var view = require("ui/core/view");
var utils = require("utils/utils");
global.moduleMerge(common, exports);
var ActionItem = (function (_super) {
    __extends(ActionItem, _super);
    function ActionItem() {
        _super.apply(this, arguments);
        this._ios = { position: enums.IOSActionItemPosition.left };
    }
    Object.defineProperty(ActionItem.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        set: function (value) {
            throw new Error("ActionItem.android is read-only");
        },
        enumerable: true,
        configurable: true
    });
    return ActionItem;
})(common.ActionItemBase);
exports.ActionItem = ActionItem;
var ActionBar = (function (_super) {
    __extends(ActionBar, _super);
    function ActionBar() {
        _super.apply(this, arguments);
    }
    ActionBar.prototype.update = function () {
        if (!(this.page && this.page.parent)) {
            return;
        }
        var viewController = this.page.ios;
        var navigationItem = viewController.navigationItem;
        var navController = frameModule.topmost().ios.controller;
        var navigationBar = navController.navigationBar;
        var previousController;
        navigationItem.title = this.title;
        if (this.titleView && this.titleView.ios) {
            console.log("setting center view: " + this.titleView.ios);
            navigationItem.titleView = this.titleView.ios;
        }
        var indexOfViewController = navController.viewControllers.indexOfObject(viewController);
        if (indexOfViewController !== NSNotFound && indexOfViewController > 0) {
            previousController = navController.viewControllers[indexOfViewController - 1];
        }
        if (previousController) {
            if (this.navigationButton) {
                var tapHandler = TapBarItemHandlerImpl.new().initWithOwner(this.navigationButton);
                var barButtonItem = UIBarButtonItem.alloc().initWithTitleStyleTargetAction(this.navigationButton.text, UIBarButtonItemStyle.UIBarButtonItemStylePlain, tapHandler, "tap");
                previousController.navigationItem.backBarButtonItem = barButtonItem;
            }
            else {
                previousController.navigationItem.backBarButtonItem = null;
            }
        }
        var img;
        if (this.navigationButton && this.navigationButton.icon) {
            img = imageSource.fromFileOrResource(this.navigationButton.icon);
        }
        if (img && img.ios) {
            var image = img.ios.imageWithRenderingMode(UIImageRenderingMode.UIImageRenderingModeAlwaysOriginal);
            navigationBar.backIndicatorImage = image;
            navigationBar.backIndicatorTransitionMaskImage = image;
        }
        else {
            navigationBar.backIndicatorImage = null;
            navigationBar.backIndicatorTransitionMaskImage = null;
        }
        this.populateMenuItems(navigationItem);
    };
    ActionBar.prototype.populateMenuItems = function (navigationItem) {
        var items = this.actionItems.getItems();
        var leftBarItems = [];
        var rightBarItems = [];
        for (var i = 0; i < items.length; i++) {
            var barButtonItem = this.createBarButtonItem(items[i]);
            if (items[i].ios.position === enums.IOSActionItemPosition.left) {
                leftBarItems.push(barButtonItem);
            }
            else {
                rightBarItems.push(barButtonItem);
            }
        }
        var leftArray = leftBarItems.length > 0 ? NSMutableArray.new() : null;
        leftBarItems.forEach(function (barItem, i, a) { return leftArray.addObject(barItem); });
        var rightArray = rightBarItems.length > 0 ? NSMutableArray.new() : null;
        rightBarItems.reverse();
        rightBarItems.forEach(function (barItem, i, a) { return rightArray.addObject(barItem); });
        navigationItem.leftItemsSupplementBackButton = true;
        navigationItem.setLeftBarButtonItemsAnimated(leftArray, true);
        navigationItem.setRightBarButtonItemsAnimated(rightArray, true);
    };
    ActionBar.prototype.createBarButtonItem = function (item) {
        var tapHandler = TapBarItemHandlerImpl.new().initWithOwner(item);
        item.handler = tapHandler;
        var barButtonItem;
        if (item.icon) {
            var img = imageSource.fromFileOrResource(item.icon);
            if (img && img.ios) {
                barButtonItem = UIBarButtonItem.alloc().initWithImageStyleTargetAction(img.ios, UIBarButtonItemStyle.UIBarButtonItemStylePlain, tapHandler, "tap");
            }
        }
        else {
            barButtonItem = UIBarButtonItem.alloc().initWithTitleStyleTargetAction(item.text, UIBarButtonItemStyle.UIBarButtonItemStylePlain, tapHandler, "tap");
        }
        return barButtonItem;
    };
    ActionBar.prototype._onTitlePropertyChanged = function () {
        if (!this.page) {
            return;
        }
        var navigationItem = this.page.ios.navigationItem;
        navigationItem.title = this.title;
    };
    ActionBar.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        if (this.titleView) {
            var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
            view.View.measureChild(this, this.titleView, utils.layout.makeMeasureSpec(width, utils.layout.AT_MOST), utils.layout.makeMeasureSpec(this.navigationBarHeight, utils.layout.AT_MOST));
        }
        this.setMeasuredDimension(0, 0);
        _super.prototype.onMeasure.call(this, widthMeasureSpec, heightMeasureSpec);
    };
    ActionBar.prototype.onLayout = function (left, top, right, bottom) {
        view.View.layoutChild(this, this.titleView, 0, 0, right - left, this.navigationBarHeight);
        _super.prototype.onLayout.call(this, left, top, right, bottom);
    };
    Object.defineProperty(ActionBar.prototype, "navigationBarHeight", {
        get: function () {
            var navController = frameModule.topmost().ios.controller;
            if (!navController) {
                return 0;
            }
            var navigationBar = navController.navigationBar;
            return (navigationBar && !navController.navigationBarHidden) ? navigationBar.frame.size.height : 0;
        },
        enumerable: true,
        configurable: true
    });
    return ActionBar;
})(common.ActionBar);
exports.ActionBar = ActionBar;
var TapBarItemHandlerImpl = (function (_super) {
    __extends(TapBarItemHandlerImpl, _super);
    function TapBarItemHandlerImpl() {
        _super.apply(this, arguments);
    }
    TapBarItemHandlerImpl.new = function () {
        return _super.new.call(this);
    };
    TapBarItemHandlerImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    TapBarItemHandlerImpl.prototype.tap = function (args) {
        this._owner._raiseTap();
    };
    TapBarItemHandlerImpl.ObjCExposedMethods = {
        "tap": { returns: interop.types.void, params: [interop.types.id] }
    };
    return TapBarItemHandlerImpl;
})(NSObject);
