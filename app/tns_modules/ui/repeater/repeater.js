var proxy = require("ui/core/proxy");
var dependencyObservable = require("ui/core/dependency-observable");
var viewModule = require("ui/core/view");
var observable = require("data/observable");
var observableArray = require("data/observable-array");
var weakEvents = require("ui/core/weak-event-listener");
var types = require("utils/types");
var stackLayoutModule = require("ui/layouts/stack-layout");
var builder = require("ui/builder");
var utils = require("utils/utils");
var platform = require("platform");
var labelModule = require("ui/label");
var ITEMS = "items";
var ITEMTEMPLATE = "itemTemplate";
var LAYOUT = "layout";
var REPEATER = "Repeater";
var knownTemplates;
(function (knownTemplates) {
    knownTemplates.itemTemplate = "itemTemplate";
})(knownTemplates = exports.knownTemplates || (exports.knownTemplates = {}));
function onItemsPropertyChanged(data) {
    var repeater = data.object;
    repeater._onItemsPropertyChanged(data);
}
function onItemTemplatePropertyChanged(data) {
    var repeater = data.object;
    repeater.refresh();
}
function onItemsLayoutPropertyPropertyChanged(data) {
    var repeater = data.object;
    repeater.refresh();
}
var Repeater = (function (_super) {
    __extends(Repeater, _super);
    function Repeater() {
        _super.call(this);
        this.isDirty = true;
        if (platform.device.os === platform.platformNames.ios) {
            this._ios = UIView.new();
        }
    }
    Object.defineProperty(Repeater.prototype, "items", {
        get: function () {
            return this._getValue(Repeater.itemsProperty);
        },
        set: function (value) {
            this._setValue(Repeater.itemsProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Repeater.prototype, "itemTemplate", {
        get: function () {
            return this._getValue(Repeater.itemTemplateProperty);
        },
        set: function (value) {
            this._setValue(Repeater.itemTemplateProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Repeater.prototype, "itemsLayout", {
        get: function () {
            return this._getValue(Repeater.itemsLayoutProperty);
        },
        set: function (value) {
            this._setValue(Repeater.itemsLayoutProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Repeater.prototype.refresh = function () {
        this.isDirty = true;
        this._createChildren();
    };
    Repeater.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._createChildren();
    };
    Repeater.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
    };
    Repeater.prototype._onItemsPropertyChanged = function (data) {
        if (data.oldValue instanceof observable.Observable) {
            weakEvents.removeWeakEventListener(data.oldValue, observableArray.ObservableArray.changeEvent, this._onItemsChanged, this);
        }
        if (data.newValue instanceof observable.Observable) {
            weakEvents.addWeakEventListener(data.newValue, observableArray.ObservableArray.changeEvent, this._onItemsChanged, this);
        }
        if (types.isUndefined(this.itemsLayout)) {
            this.itemsLayout = new stackLayoutModule.StackLayout();
        }
        if (this.itemsLayout.parent !== this) {
            this._addView(this.itemsLayout);
        }
        this.refresh();
    };
    Repeater.prototype._onItemsChanged = function (args) {
        this.refresh();
    };
    Repeater.prototype._createChildren = function () {
        if (this.isDirty && this.isLoaded) {
            clearItemsLayout(this.itemsLayout);
            if (!types.isNullOrUndefined(this.items) && types.isNumber(this.items.length)) {
                var i;
                for (i = 0; i < this.items.length; i++) {
                    var viewToAdd = !types.isNullOrUndefined(this.itemTemplate) ? builder.parse(this.itemTemplate, this) : this._getDefaultItemContent(i);
                    if (!types.isNullOrUndefined(viewToAdd)) {
                        this.itemsLayout.addChild(viewToAdd);
                        viewToAdd.bindingContext = this._getDataItem(i);
                    }
                }
            }
            this.isDirty = false;
        }
    };
    Repeater.prototype._getDefaultItemContent = function (index) {
        var lbl = new labelModule.Label();
        lbl.bind({
            targetProperty: "text",
            sourceProperty: "$value"
        });
        return lbl;
    };
    Repeater.prototype._getDataItem = function (index) {
        return this.items.getItem ? this.items.getItem(index) : this.items[index];
    };
    Object.defineProperty(Repeater.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Repeater.prototype, "_childrenCount", {
        get: function () {
            var count = 0;
            if (this.itemsLayout) {
                count++;
            }
            return count;
        },
        enumerable: true,
        configurable: true
    });
    Repeater.prototype._eachChildView = function (callback) {
        if (this.itemsLayout) {
            callback(this.itemsLayout);
        }
    };
    Repeater.prototype.onLayout = function (left, top, right, bottom) {
        viewModule.View.layoutChild(this, this.itemsLayout, 0, 0, right, bottom);
    };
    Repeater.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var result = viewModule.View.measureChild(this, this.itemsLayout, widthMeasureSpec, heightMeasureSpec);
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var widthAndState = viewModule.View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        var heightAndState = viewModule.View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Repeater.itemsProperty = new dependencyObservable.Property(ITEMS, REPEATER, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, onItemsPropertyChanged));
    Repeater.itemTemplateProperty = new dependencyObservable.Property(ITEMTEMPLATE, REPEATER, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, onItemTemplatePropertyChanged));
    Repeater.itemsLayoutProperty = new dependencyObservable.Property(LAYOUT, REPEATER, new proxy.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, onItemsLayoutPropertyPropertyChanged));
    return Repeater;
})(viewModule.CustomLayoutView);
exports.Repeater = Repeater;
function clearItemsLayout(itemsLayout) {
    if (!types.isNullOrUndefined(itemsLayout)) {
        var i = itemsLayout.getChildrenCount();
        if (i > 0) {
            while (i >= 0) {
                var child = itemsLayout.getChildAt(i);
                if (!types.isNullOrUndefined(child)) {
                    itemsLayout.removeChild(child);
                }
                i--;
            }
        }
    }
}
