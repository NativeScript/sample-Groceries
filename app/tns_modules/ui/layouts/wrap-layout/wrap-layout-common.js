var layouts = require("ui/layouts/layout-base");
var dependencyObservable = require("ui/core/dependency-observable");
var enums = require("ui/enums");
var proxy = require("ui/core/proxy");
var AffectsLayout = global.android ? dependencyObservable.PropertyMetadataSettings.None : dependencyObservable.PropertyMetadataSettings.AffectsLayout;
function isWidthHeightValid(value) {
    return (value >= 0.0 && value !== Number.POSITIVE_INFINITY);
}
function isValidOrientation(value) {
    return value === enums.Orientation.vertical || value === enums.Orientation.horizontal;
}
var WrapLayout = (function (_super) {
    __extends(WrapLayout, _super);
    function WrapLayout() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(WrapLayout.prototype, "orientation", {
        get: function () {
            return this._getValue(WrapLayout.orientationProperty);
        },
        set: function (value) {
            this._setValue(WrapLayout.orientationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapLayout.prototype, "itemWidth", {
        get: function () {
            return this._getValue(WrapLayout.itemWidthProperty);
        },
        set: function (value) {
            this._setValue(WrapLayout.itemWidthProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapLayout.prototype, "itemHeight", {
        get: function () {
            return this._getValue(WrapLayout.itemHeightProperty);
        },
        set: function (value) {
            this._setValue(WrapLayout.itemHeightProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    WrapLayout.orientationProperty = new dependencyObservable.Property("orientation", "WrapLayout", new proxy.PropertyMetadata(enums.Orientation.horizontal, AffectsLayout, undefined, isValidOrientation));
    WrapLayout.itemWidthProperty = new dependencyObservable.Property("itemWidth", "WrapLayout", new proxy.PropertyMetadata(0, AffectsLayout, undefined, isWidthHeightValid));
    WrapLayout.itemHeightProperty = new dependencyObservable.Property("itemHeight", "WrapLayout", new proxy.PropertyMetadata(0, AffectsLayout, undefined, isWidthHeightValid));
    return WrapLayout;
})(layouts.LayoutBase);
exports.WrapLayout = WrapLayout;
