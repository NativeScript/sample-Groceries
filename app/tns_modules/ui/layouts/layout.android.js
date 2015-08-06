var view = require("ui/core/view");
var layoutBase = require("ui/layouts/layout-base");
var trace = require("trace");
var utils = require("utils/utils");
var OWNER = "_owner";
var Layout = (function (_super) {
    __extends(Layout, _super);
    function Layout() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Layout.prototype, "android", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "_nativeView", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Layout.prototype._createUI = function () {
        this._viewGroup = new view.NativeViewGroup(this._context);
        this._viewGroup[OWNER] = this;
    };
    Layout.prototype._onDetached = function (force) {
        delete this._viewGroup[OWNER];
        _super.prototype._onDetached.call(this, force);
    };
    Layout.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        var view = this._nativeView;
        if (view) {
            var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
            var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
            var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
            var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
            trace.write(this + " :measure: " + utils.layout.getMode(widthMode) + " " + width + ", " + utils.layout.getMode(heightMode) + " " + height, trace.categories.Layout);
            view.measure(widthMeasureSpec, heightMeasureSpec);
        }
    };
    Layout.prototype.layout = function (left, top, right, bottom) {
        this._setCurrentLayoutBounds(left, top, right, bottom);
        var view = this._nativeView;
        if (view) {
            this.layoutNativeView(left, top, right, bottom);
            trace.write(this + " :layout: " + left + ", " + top + ", " + (right - left) + ", " + (bottom - top), trace.categories.Layout);
        }
    };
    Layout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        // Don't call super because it will trigger measure again.
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        trace.write(this + " :onMeasure: " + utils.layout.getMode(widthMode) + " " + width + ", " + utils.layout.getMode(heightMode) + " " + height, trace.categories.Layout);
    };
    Layout.prototype.onLayout = function (left, top, right, bottom) {
        trace.write(this + " :onLayout: " + left + ", " + top + ", " + (right - left) + ", " + (bottom - top), trace.categories.Layout);
    };
    return Layout;
})(layoutBase.LayoutBase);
exports.Layout = Layout;
