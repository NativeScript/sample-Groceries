var common = require("ui/layouts/stack-layout/stack-layout-common");
var enums = require("ui/enums");
global.moduleMerge(common, exports);
var StackLayout = (function (_super) {
    __extends(StackLayout, _super);
    function StackLayout() {
        _super.apply(this, arguments);
    }
    StackLayout.setNativeOrientationProperty = function (data) {
        var stackLayout = data.object;
        var nativeView = stackLayout._nativeView;
        nativeView.setOrientation(data.newValue === enums.Orientation.vertical ? org.nativescript.widgets.Orientation.vertical : org.nativescript.widgets.Orientation.horzontal);
    };
    Object.defineProperty(StackLayout.prototype, "android", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackLayout.prototype, "_nativeView", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    StackLayout.prototype._createUI = function () {
        this._layout = new org.nativescript.widgets.StackLayout(this._context);
    };
    return StackLayout;
})(common.StackLayout);
exports.StackLayout = StackLayout;
common.StackLayout.orientationProperty.metadata.onSetNativeValue = StackLayout.setNativeOrientationProperty;
