var common = require("ui/layouts/wrap-layout/wrap-layout-common");
var enums = require("ui/enums");
var utils = require("utils/utils");
global.moduleMerge(common, exports);
var WrapLayout = (function (_super) {
    __extends(WrapLayout, _super);
    function WrapLayout() {
        _super.apply(this, arguments);
    }
    WrapLayout.setNativeOrientationProperty = function (data) {
        var wrapLayout = data.object;
        var nativeView = wrapLayout._nativeView;
        nativeView.setOrientation(data.newValue === enums.Orientation.vertical ? org.nativescript.widgets.Orientation.vertical : org.nativescript.widgets.Orientation.horzontal);
    };
    WrapLayout.setNativeItemWidthProperty = function (data) {
        var wrapLayout = data.object;
        var nativeView = wrapLayout._nativeView;
        nativeView.setItemWidth(data.newValue * utils.layout.getDisplayDensity());
    };
    WrapLayout.setNativeItemHeightProperty = function (data) {
        var wrapLayout = data.object;
        var nativeView = wrapLayout._nativeView;
        nativeView.setItemHeight(data.newValue * utils.layout.getDisplayDensity());
    };
    Object.defineProperty(WrapLayout.prototype, "android", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrapLayout.prototype, "_nativeView", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    WrapLayout.prototype._createUI = function () {
        this._layout = new org.nativescript.widgets.WrapLayout(this._context);
    };
    return WrapLayout;
})(common.WrapLayout);
exports.WrapLayout = WrapLayout;
common.WrapLayout.orientationProperty.metadata.onSetNativeValue = WrapLayout.setNativeOrientationProperty;
common.WrapLayout.itemWidthProperty.metadata.onSetNativeValue = WrapLayout.setNativeItemWidthProperty;
common.WrapLayout.itemHeightProperty.metadata.onSetNativeValue = WrapLayout.setNativeItemHeightProperty;
