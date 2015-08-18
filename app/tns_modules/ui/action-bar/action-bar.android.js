var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/action-bar/action-bar-common");
var trace = require("trace");
var frame = require("ui/frame");
var types = require("utils/types");
var utils = require("utils/utils");
var imageSource = require("image-source");
var enums = require("ui/enums");
var application = require("application");
var ACTION_ITEM_ID_OFFSET = 1000;
var API_LVL = android.os.Build.VERSION.SDK_INT;
require("utils/module-merge").merge(common, exports);
var ActionItem = (function (_super) {
    __extends(ActionItem, _super);
    function ActionItem() {
        _super.apply(this, arguments);
        this._androidPosition = { position: enums.AndroidActionItemPosition.actionBar };
    }
    Object.defineProperty(ActionItem.prototype, "android", {
        get: function () {
            return this._androidPosition;
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
var AndroidActionBarSettings = (function () {
    function AndroidActionBarSettings(actionBar) {
        this._iconVisibility = enums.AndroidActionBarIconVisibility.auto;
        this._actionBar = actionBar;
    }
    Object.defineProperty(AndroidActionBarSettings.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (value) {
            if (value !== this._icon) {
                this._icon = value;
                this._actionBar._onIconPropertyChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidActionBarSettings.prototype, "iconVisibility", {
        get: function () {
            return this._iconVisibility;
        },
        set: function (value) {
            if (value !== this._iconVisibility) {
                this._iconVisibility = value;
                this._actionBar._onIconPropertyChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    return AndroidActionBarSettings;
})();
exports.AndroidActionBarSettings = AndroidActionBarSettings;
var ActionBar = (function (_super) {
    __extends(ActionBar, _super);
    function ActionBar() {
        _super.call(this);
        this._appResources = application.android.context.getResources();
        this._android = new AndroidActionBarSettings(this);
    }
    Object.defineProperty(ActionBar.prototype, "android", {
        get: function () {
            return this._android;
        },
        set: function (value) {
            throw new Error("ActionBar.android is read-only");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "_nativeView", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    ActionBar.prototype.update = function () {
        if (this.page && this.page.frame && this.page.frame.android && this.page.frame.android.activity) {
            this.page.frame.android.activity.invalidateOptionsMenu();
        }
    };
    ActionBar.prototype._onAndroidItemSelected = function (itemId) {
        var menuItem = this.actionItems.getItemAt(itemId - ACTION_ITEM_ID_OFFSET);
        if (menuItem) {
            menuItem._raiseTap();
            return true;
        }
        if (this.navigationButton && itemId === android.R.id.home) {
            this.navigationButton._raiseTap();
            return true;
        }
        return false;
    };
    ActionBar.prototype._updateAndroid = function (menu) {
        var actionBar = frame.topmost().android.actionBar;
        if (this.page.actionBarHidden) {
            if (actionBar.isShowing()) {
                actionBar.hide();
            }
            return;
        }
        if (!actionBar.isShowing()) {
            actionBar.show();
        }
        this._addActionItems(menu);
        this._updateTitleAndTitleView(actionBar);
        this._updateIcon(actionBar);
        this._updateNavigationButton(actionBar);
    };
    ActionBar.prototype._updateNavigationButton = function (actionBar) {
        var navButton = this.navigationButton;
        if (navButton) {
            if (API_LVL >= 18) {
                var drawableOrId = getDrawableOrResourceId(navButton.icon, this._appResources);
                if (!drawableOrId) {
                    drawableOrId = 0;
                }
                setHomeAsUpIndicator(actionBar, drawableOrId);
            }
            actionBar.setDisplayHomeAsUpEnabled(true);
        }
        else {
            actionBar.setDisplayHomeAsUpEnabled(false);
        }
    };
    ActionBar.prototype._updateIcon = function (actionBar) {
        var icon = this.android.icon;
        if (types.isDefined(icon)) {
            var drawableOrId = getDrawableOrResourceId(icon, this._appResources);
            if (drawableOrId) {
                actionBar.setIcon(drawableOrId);
            }
        }
        else {
            var defaultIcon = application.android.nativeApp.getApplicationInfo().icon;
            actionBar.setIcon(defaultIcon);
        }
        var visibility = getIconVisibility(this.android.iconVisibility);
        actionBar.setDisplayShowHomeEnabled(visibility);
    };
    ActionBar.prototype._updateTitleAndTitleView = function (actionBar) {
        if (this.titleView) {
            actionBar.setCustomView(this.titleView.android);
            actionBar.setDisplayShowCustomEnabled(true);
            actionBar.setDisplayShowTitleEnabled(false);
        }
        else {
            actionBar.setCustomView(null);
            actionBar.setDisplayShowCustomEnabled(false);
            actionBar.setDisplayShowTitleEnabled(true);
            var title = this.title;
            if (types.isDefined(title)) {
                actionBar.setTitle(title);
            }
            else {
                var defaultLabel = application.android.nativeApp.getApplicationInfo().labelRes;
                actionBar.setTitle(defaultLabel);
            }
        }
    };
    ActionBar.prototype._addActionItems = function (menu) {
        var items = this.actionItems.getItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var menuItem = menu.add(android.view.Menu.NONE, i + ACTION_ITEM_ID_OFFSET, android.view.Menu.NONE, item.text);
            if (item.icon) {
                var drawableOrId = getDrawableOrResourceId(item.icon, this._appResources);
                if (drawableOrId) {
                    menuItem.setIcon(drawableOrId);
                }
            }
            var showAsAction = getShowAsAction(item);
            menuItem.setShowAsAction(showAsAction);
        }
    };
    ActionBar.prototype._onTitlePropertyChanged = function () {
        var topFrame = frame.topmost();
        if (topFrame && topFrame.currentPage === this.page) {
            this._updateTitleAndTitleView(frame.topmost().android.actionBar);
        }
    };
    ActionBar.prototype._onIconPropertyChanged = function () {
        var topFrame = frame.topmost();
        if (topFrame && topFrame.currentPage === this.page) {
            this._updateIcon(frame.topmost().android.actionBar);
        }
    };
    ActionBar.prototype._clearAndroidReference = function () {
    };
    return ActionBar;
})(common.ActionBar);
exports.ActionBar = ActionBar;
var setHomeAsUpIndicatorWithResoruceId;
var setHomeAsUpIndicatorWithDrawable;
function setHomeAsUpIndicator(actionBar, drawableOrId) {
    try {
        var paramsArr = java.lang.reflect.Array.newInstance(java.lang.Object.class, 1);
        if (types.isNumber(drawableOrId)) {
            if (!setHomeAsUpIndicatorWithResoruceId) {
                var typeArr = java.lang.reflect.Array.newInstance(java.lang.Class.class, 1);
                typeArr[0] = java.lang.Integer.TYPE;
                setHomeAsUpIndicatorWithResoruceId = actionBar.getClass().getMethod("setHomeAsUpIndicator", typeArr);
            }
            paramsArr[0] = new java.lang.Integer(drawableOrId);
            setHomeAsUpIndicatorWithResoruceId.invoke(actionBar, paramsArr);
        }
        else {
            if (!setHomeAsUpIndicatorWithDrawable) {
                var typeArr = java.lang.reflect.Array.newInstance(java.lang.Class.class, 1);
                typeArr[0] = android.graphics.drawable.Drawable.class;
                setHomeAsUpIndicatorWithDrawable = actionBar.getClass().getMethod("setHomeAsUpIndicator", typeArr);
            }
            paramsArr[0] = drawableOrId;
            setHomeAsUpIndicatorWithDrawable.invoke(actionBar, paramsArr);
        }
    }
    catch (e) {
        trace.write("Failed to set navigation icon: " + e, trace.categories.Error, trace.messageType.error);
    }
}
function getDrawableOrResourceId(icon, resources) {
    if (!types.isString(icon)) {
        return undefined;
    }
    if (icon.indexOf(utils.RESOURCE_PREFIX) === 0) {
        var resourceId = resources.getIdentifier(icon.substr(utils.RESOURCE_PREFIX.length), 'drawable', application.android.packageName);
        if (resourceId > 0) {
            return resourceId;
        }
    }
    else {
        var drawable;
        var is = imageSource.fromFileOrResource(icon);
        if (is) {
            drawable = new android.graphics.drawable.BitmapDrawable(is.android);
        }
        return drawable;
    }
    return undefined;
}
function getShowAsAction(menuItem) {
    switch (menuItem.android.position) {
        case enums.AndroidActionItemPosition.actionBarIfRoom:
            return android.view.MenuItem.SHOW_AS_ACTION_IF_ROOM;
        case enums.AndroidActionItemPosition.popup:
            return android.view.MenuItem.SHOW_AS_ACTION_NEVER;
        case enums.AndroidActionItemPosition.actionBar:
        default:
            return android.view.MenuItem.SHOW_AS_ACTION_ALWAYS;
    }
}
function getIconVisibility(iconVisibility) {
    switch (iconVisibility) {
        case enums.AndroidActionBarIconVisibility.always:
            return true;
        case enums.AndroidActionBarIconVisibility.never:
            return false;
        case enums.AndroidActionBarIconVisibility.auto:
        default:
            return API_LVL <= 20;
    }
}
