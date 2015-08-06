var view = require("ui/core/view");
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var types = require("utils/types");
var trace = require("trace");
exports.traceCategory = "TabView";
var TAB_VIEW = "TabView";
var ITEMS = "items";
var SELECTED_INDEX = "selectedIndex";
var knownCollections;
(function (knownCollections) {
    knownCollections.items = "items";
})(knownCollections = exports.knownCollections || (exports.knownCollections = {}));
var itemsProperty = new dependencyObservable.Property(ITEMS, TAB_VIEW, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout));
var selectedIndexProperty = new dependencyObservable.Property(SELECTED_INDEX, TAB_VIEW, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout));
selectedIndexProperty.metadata.onSetNativeValue = function (data) {
    var tabView = data.object;
    tabView._onSelectedIndexPropertyChangedSetNativeValue(data);
};
itemsProperty.metadata.onSetNativeValue = function (data) {
    var tabView = data.object;
    tabView._onItemsPropertyChangedSetNativeValue(data);
};
var TabView = (function (_super) {
    __extends(TabView, _super);
    function TabView() {
        _super.apply(this, arguments);
    }
    TabView.prototype._addArrayFromBuilder = function (name, value) {
        if (name === ITEMS) {
            this.items = value;
        }
    };
    Object.defineProperty(TabView.prototype, "items", {
        get: function () {
            return this._getValue(TabView.itemsProperty);
        },
        set: function (value) {
            this._setValue(TabView.itemsProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    TabView.prototype._onItemsPropertyChangedSetNativeValue = function (data) {
        trace.write("TabView.__onItemsPropertyChangedSetNativeValue(" + data.oldValue + " -> " + data.newValue + ");", exports.traceCategory);
        if (data.oldValue) {
            this._removeTabs(data.oldValue);
        }
        if (data.newValue) {
            this._addTabs(data.newValue);
        }
        this._updateSelectedIndexOnItemsPropertyChanged(data.newValue);
    };
    TabView.prototype._updateSelectedIndexOnItemsPropertyChanged = function (newItems) {
        trace.write("TabView._updateSelectedIndexOnItemsPropertyChanged(" + newItems + ");", exports.traceCategory);
        var newItemsCount = 0;
        if (newItems) {
            newItemsCount = newItems.length;
        }
        if (newItemsCount === 0) {
            this.selectedIndex = undefined;
        }
        else if (types.isUndefined(this.selectedIndex) || this.selectedIndex >= newItemsCount) {
            this.selectedIndex = 0;
        }
    };
    TabView.prototype._removeTabs = function (oldItems) {
    };
    TabView.prototype._addTabs = function (newItems) {
        var i;
        var length = newItems.length;
        var newItem;
        for (i = 0; i < length; i++) {
            newItem = newItems[i];
            if (!newItem) {
                throw new Error("TabViewItem at index " + i + " is undefined.");
            }
            if (!newItem.view) {
                throw new Error("TabViewItem at index " + i + " does not have a view.");
            }
        }
    };
    Object.defineProperty(TabView.prototype, "selectedIndex", {
        get: function () {
            return this._getValue(TabView.selectedIndexProperty);
        },
        set: function (value) {
            this._setValue(TabView.selectedIndexProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    TabView.prototype._onSelectedIndexPropertyChangedSetNativeValue = function (data) {
        var index = this.selectedIndex;
        if (types.isUndefined(index)) {
            return;
        }
        if (types.isDefined(this.items)) {
            if (index < 0 || index >= this.items.length) {
                this.selectedIndex = undefined;
                throw new Error("SelectedIndex should be between [0, items.length)");
            }
        }
    };
    Object.defineProperty(TabView.prototype, "_selectedView", {
        get: function () {
            var _items = this.items;
            var _selectedIndex = this.selectedIndex;
            if (!_items) {
                return undefined;
            }
            if (_items.length === 0) {
                return undefined;
            }
            if (_selectedIndex === undefined) {
                return undefined;
            }
            return _items[_selectedIndex].view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabView.prototype, "_childrenCount", {
        get: function () {
            if (this.items) {
                return this.items.length;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    TabView.prototype._eachChildView = function (callback) {
        var _items = this.items;
        if (!_items) {
            return;
        }
        var i;
        var length = _items.length;
        var item;
        var retVal;
        for (i = 0; i < length; i++) {
            item = _items[i];
            if (item.view) {
                retVal = callback(item.view);
                if (retVal === false) {
                    break;
                }
            }
        }
    };
    TabView.itemsProperty = itemsProperty;
    TabView.selectedIndexProperty = selectedIndexProperty;
    TabView.selectedIndexChangedEvent = "selectedIndexChanged";
    return TabView;
})(view.View);
exports.TabView = TabView;
