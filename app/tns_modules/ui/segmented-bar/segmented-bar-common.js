var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");
var proxy = require("ui/core/proxy");
var dependencyObservable = require("ui/core/dependency-observable");
var color = require("color");
var types = require("utils/types");
var knownCollections;
(function (knownCollections) {
    knownCollections.items = "items";
})(knownCollections = exports.knownCollections || (exports.knownCollections = {}));
var SegmentedBar = (function (_super) {
    __extends(SegmentedBar, _super);
    function SegmentedBar() {
        _super.apply(this, arguments);
    }
    SegmentedBar.prototype._addArrayFromBuilder = function (name, value) {
        if (name === "items") {
            this._setValue(SegmentedBar.itemsProperty, value);
        }
    };
    SegmentedBar.prototype._adjustSelectedIndex = function (items) {
        if (this.items) {
            if (this.items.length > 0) {
                if (types.isUndefined(this.selectedIndex) || (this.selectedIndex > this.items.length - 1)) {
                    this._setValue(SegmentedBar.selectedIndexProperty, 0);
                }
            }
            else {
                this._setValue(SegmentedBar.selectedIndexProperty, undefined);
            }
        }
        else {
            this._setValue(SegmentedBar.selectedIndexProperty, undefined);
        }
    };
    Object.defineProperty(SegmentedBar.prototype, "selectedIndex", {
        get: function () {
            return this._getValue(SegmentedBar.selectedIndexProperty);
        },
        set: function (value) {
            this._setValue(SegmentedBar.selectedIndexProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBar.prototype, "items", {
        get: function () {
            return this._getValue(SegmentedBar.itemsProperty);
        },
        set: function (value) {
            this._setValue(SegmentedBar.itemsProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SegmentedBar.prototype, "selectedBackgroundColor", {
        get: function () {
            return this._getValue(SegmentedBar.selectedBackgroundColorProperty);
        },
        set: function (value) {
            this._setValue(SegmentedBar.selectedBackgroundColorProperty, value instanceof color.Color ? value : new color.Color(value));
        },
        enumerable: true,
        configurable: true
    });
    SegmentedBar.selectedBackgroundColorProperty = new dependencyObservable.Property("selectedBackgroundColor", "SegmentedBar", new proxy.PropertyMetadata(undefined));
    SegmentedBar.selectedIndexProperty = new dependencyObservable.Property("selectedIndex", "SegmentedBar", new proxy.PropertyMetadata(undefined));
    SegmentedBar.itemsProperty = new dependencyObservable.Property("items", "SegmentedBar", new proxy.PropertyMetadata(undefined));
    return SegmentedBar;
})(view.View);
exports.SegmentedBar = SegmentedBar;
