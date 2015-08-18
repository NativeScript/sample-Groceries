var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var bindable = require("ui/core/bindable");
var dependencyObservable = require("ui/core/dependency-observable");
var enums = require("ui/enums");
var proxy = require("ui/core/proxy");
var view = require("ui/core/view");
var style = require("ui/styling/style");
var observable = require("ui/core/dependency-observable");
var ACTION_ITEMS = "actionItems";
var knownCollections;
(function (knownCollections) {
    knownCollections.actionItems = "actionItems";
})(knownCollections = exports.knownCollections || (exports.knownCollections = {}));
function onTitlePropertyChanged(data) {
    var actionBar = data.object;
    actionBar._onTitlePropertyChanged();
}
var ActionBar = (function (_super) {
    __extends(ActionBar, _super);
    function ActionBar() {
        _super.call(this);
        this._actionItems = new ActionItems(this);
    }
    Object.defineProperty(ActionBar.prototype, "title", {
        get: function () {
            return this._getValue(ActionBar.titleProperty);
        },
        set: function (value) {
            this._setValue(ActionBar.titleProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "navigationButton", {
        get: function () {
            return this._navigationButton;
        },
        set: function (value) {
            if (this._navigationButton !== value) {
                if (this._navigationButton) {
                    this._navigationButton.actionBar = undefined;
                }
                this._navigationButton = value;
                if (this._navigationButton) {
                    this._navigationButton.actionBar = this;
                }
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "actionItems", {
        get: function () {
            return this._actionItems;
        },
        set: function (value) {
            throw new Error("actionItems property is read-only");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "titleView", {
        get: function () {
            return this._titleView;
        },
        set: function (value) {
            if (this._titleView !== value) {
                if (this._titleView) {
                    this._removeView(this._titleView);
                    this._titleView.style._resetValue(style.horizontalAlignmentProperty, observable.ValueSource.Inherited);
                    this._titleView.style._resetValue(style.verticalAlignmentProperty, observable.ValueSource.Inherited);
                }
                this._titleView = value;
                if (this._titleView) {
                    this._titleView.style._setValue(style.horizontalAlignmentProperty, enums.HorizontalAlignment.center, observable.ValueSource.Inherited);
                    this._titleView.style._setValue(style.verticalAlignmentProperty, enums.VerticalAlignment.center, observable.ValueSource.Inherited);
                    this._addView(this._titleView);
                }
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "page", {
        get: function () {
            return this._page;
        },
        set: function (value) {
            this._page = value;
            this.unbind("bindingContext");
            this.bind({
                sourceProperty: "bindingContext",
                targetProperty: "bindingContext"
            }, this._page);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "android", {
        get: function () {
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "_childrenCount", {
        get: function () {
            return this.titleView ? 1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    ActionBar.prototype.update = function () {
    };
    ActionBar.prototype._onTitlePropertyChanged = function () {
    };
    ActionBar.prototype._updateAndroid = function (menu) {
    };
    ActionBar.prototype._onAndroidItemSelected = function (itemId) {
        return false;
    };
    ActionBar.prototype._addArrayFromBuilder = function (name, value) {
        if (name === ACTION_ITEMS) {
            this.actionItems.setItems(value);
        }
    };
    ActionBar.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof NavigationButton) {
            this.navigationButton = value;
        }
        if (value instanceof view.View) {
            this.titleView = value;
        }
    };
    ActionBar.prototype._onBindingContextChanged = function (oldValue, newValue) {
        _super.prototype._onBindingContextChanged.call(this, oldValue, newValue);
        if (this._navigationButton) {
            this._navigationButton.bindingContext = newValue;
        }
        this._actionItems.getItems().forEach(function (item, i, arr) { item.bindingContext = newValue; });
    };
    ActionBar.prototype._eachChildView = function (callback) {
        if (this.titleView) {
            callback(this.titleView);
        }
    };
    ActionBar.prototype._isEmpty = function () {
        if (this.title ||
            (this.android && this.android.icon) ||
            this.navigationButton ||
            this.actionItems.getItems().length > 0) {
            return false;
        }
        return true;
    };
    ActionBar.titleProperty = new dependencyObservable.Property("title", "ActionBar", new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, onTitlePropertyChanged));
    return ActionBar;
})(view.View);
exports.ActionBar = ActionBar;
var ActionItems = (function () {
    function ActionItems(actionBar) {
        this._items = new Array();
        this._actionBar = actionBar;
    }
    ActionItems.prototype.addItem = function (item) {
        if (!item) {
            throw new Error("Cannot add empty item");
        }
        this._items.push(item);
        item.actionBar = this._actionBar;
        this.invalidate();
    };
    ActionItems.prototype.removeItem = function (item) {
        if (!item) {
            throw new Error("Cannot remove empty item");
        }
        var itemIndex = this._items.indexOf(item);
        if (itemIndex < 0) {
            throw new Error("Cannot find item to remove");
        }
        this._items.splice(itemIndex, 1);
        item.actionBar = undefined;
        this.invalidate();
    };
    ActionItems.prototype.getItems = function () {
        return this._items.slice();
    };
    ActionItems.prototype.getItemAt = function (index) {
        if (index < 0 || index >= this._items.length) {
            return undefined;
        }
        return this._items[index];
    };
    ActionItems.prototype.setItems = function (items) {
        while (this._items.length > 0) {
            this.removeItem(this._items[this._items.length - 1]);
        }
        for (var i = 0; i < items.length; i++) {
            this.addItem(items[i]);
        }
        this.invalidate();
    };
    ActionItems.prototype.invalidate = function () {
        if (this._actionBar) {
            this._actionBar.update();
        }
    };
    return ActionItems;
})();
exports.ActionItems = ActionItems;
var ActionItemBase = (function (_super) {
    __extends(ActionItemBase, _super);
    function ActionItemBase() {
        _super.apply(this, arguments);
    }
    ActionItemBase.onItemChanged = function (data) {
        var menuItem = data.object;
        if (menuItem.actionBar) {
            menuItem.actionBar.update();
        }
    };
    Object.defineProperty(ActionItemBase.prototype, "text", {
        get: function () {
            return this._getValue(ActionItemBase.textProperty);
        },
        set: function (value) {
            this._setValue(ActionItemBase.textProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionItemBase.prototype, "icon", {
        get: function () {
            return this._getValue(ActionItemBase.iconProperty);
        },
        set: function (value) {
            this._setValue(ActionItemBase.iconProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionItemBase.prototype, "actionBar", {
        get: function () {
            return this._actionBar;
        },
        set: function (value) {
            if (value !== this._actionBar) {
                this._actionBar = value;
                if (this._actionBar) {
                    this.bindingContext = this._actionBar.bindingContext;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    ActionItemBase.prototype._raiseTap = function () {
        this._emit(ActionItemBase.tapEvent);
    };
    ActionItemBase.tapEvent = "tap";
    ActionItemBase.textProperty = new dependencyObservable.Property("text", "ActionItemBase", new dependencyObservable.PropertyMetadata("", null, ActionItemBase.onItemChanged));
    ActionItemBase.iconProperty = new dependencyObservable.Property("icon", "ActionItemBase", new dependencyObservable.PropertyMetadata(null, null, ActionItemBase.onItemChanged));
    return ActionItemBase;
})(bindable.Bindable);
exports.ActionItemBase = ActionItemBase;
var NavigationButton = (function (_super) {
    __extends(NavigationButton, _super);
    function NavigationButton() {
        _super.apply(this, arguments);
    }
    return NavigationButton;
})(ActionItemBase);
exports.NavigationButton = NavigationButton;
