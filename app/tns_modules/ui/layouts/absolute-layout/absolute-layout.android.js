var utils = require("utils/utils");
var view = require("ui/core/view");
var common = require("ui/layouts/absolute-layout/absolute-layout-common");
global.moduleMerge(common, exports);
function setNativeProperty(data, setter) {
    var uiView = data.object;
    if (uiView instanceof view.View) {
        var nativeView = uiView._nativeView;
        var lp = nativeView.getLayoutParams();
        if (!(lp instanceof org.nativescript.widgets.CommonLayoutParams)) {
            lp = new org.nativescript.widgets.CommonLayoutParams();
        }
        setter(lp);
        nativeView.setLayoutParams(lp);
    }
}
function setNativeLeftProperty(data) {
    setNativeProperty(data, function (lp) { lp.left = data.newValue * utils.layout.getDisplayDensity(); });
}
function setNativeTopProperty(data) {
    setNativeProperty(data, function (lp) { lp.top = data.newValue * utils.layout.getDisplayDensity(); });
}
common.AbsoluteLayout.leftProperty.metadata.onSetNativeValue = setNativeLeftProperty;
common.AbsoluteLayout.topProperty.metadata.onSetNativeValue = setNativeTopProperty;
var AbsoluteLayout = (function (_super) {
    __extends(AbsoluteLayout, _super);
    function AbsoluteLayout() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(AbsoluteLayout.prototype, "android", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbsoluteLayout.prototype, "_nativeView", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    AbsoluteLayout.prototype._createUI = function () {
        this._layout = new org.nativescript.widgets.AbsoluteLayout(this._context);
    };
    return AbsoluteLayout;
})(common.AbsoluteLayout);
exports.AbsoluteLayout = AbsoluteLayout;
