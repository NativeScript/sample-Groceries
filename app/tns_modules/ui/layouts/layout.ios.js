var layoutBase = require("ui/layouts/layout-base");
var trace = require("trace");
var utils = require("utils/utils");
var Layout = (function (_super) {
    __extends(Layout, _super);
    function Layout() {
        _super.call(this);
        this._view = new UIView();
        this._view.autoresizesSubviews = false;
    }
    Object.defineProperty(Layout.prototype, "ios", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "_nativeView", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Layout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        // Don't call super because it will measure the native element.
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        trace.write(this + " :onMeasure: " + utils.layout.getMode(widthMode) + " " + width + ", " + utils.layout.getMode(heightMode) + " " + height, trace.categories.Layout);
    };
    return Layout;
})(layoutBase.LayoutBase);
exports.Layout = Layout;
