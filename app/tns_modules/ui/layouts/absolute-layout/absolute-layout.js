var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var layouts = require("ui/layouts/layout");
var utils = require("utils/utils");
var dependencyObservable = require("ui/core/dependency-observable");
var view = require("ui/core/view");
var numberUtils = require("utils/number-utils");
function onPropertyChanged(data) {
    var uiView = data.object;
    if (uiView instanceof view.View) {
        var layout = uiView.parent;
        if (layout instanceof AbsoluteLayout) {
            layout.requestLayout();
        }
    }
}
var AbsoluteLayout = (function (_super) {
    __extends(AbsoluteLayout, _super);
    function AbsoluteLayout() {
        _super.apply(this, arguments);
    }
    AbsoluteLayout.getLeft = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(AbsoluteLayout.leftProperty);
    };
    AbsoluteLayout.setLeft = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(AbsoluteLayout.leftProperty, value);
    };
    AbsoluteLayout.getTop = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(AbsoluteLayout.topProperty);
    };
    AbsoluteLayout.setTop = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(AbsoluteLayout.topProperty, value);
    };
    AbsoluteLayout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        _super.prototype.onMeasure.call(this, widthMeasureSpec, heightMeasureSpec);
        var measureWidth = 0;
        var measureHeight = 0;
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var childMeasureSpec = utils.layout.makeMeasureSpec(0, utils.layout.UNSPECIFIED);
        var density = utils.layout.getDisplayDensity();
        var count = this.getChildrenCount();
        for (var i = 0; i < count; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }
            var childSize = view.View.measureChild(this, child, childMeasureSpec, childMeasureSpec);
            measureWidth = Math.max(measureWidth, AbsoluteLayout.getLeft(child) * density + childSize.measuredWidth);
            measureHeight = Math.max(measureHeight, AbsoluteLayout.getTop(child) * density + childSize.measuredHeight);
        }
        measureWidth += (this.paddingLeft + this.paddingRight) * density;
        measureHeight += (this.paddingTop + this.paddingBottom) * density;
        measureWidth = Math.max(measureWidth, this.minWidth * density);
        measureHeight = Math.max(measureHeight, this.minHeight * density);
        var widthAndState = view.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    AbsoluteLayout.prototype.onLayout = function (left, top, right, bottom) {
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        var density = utils.layout.getDisplayDensity();
        var count = this.getChildrenCount();
        for (var i = 0; i < count; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }
            var childWidth = child.getMeasuredWidth();
            var childHeight = child.getMeasuredHeight();
            var childLeft = (this.paddingLeft + AbsoluteLayout.getLeft(child)) * density;
            var childTop = (this.paddingTop + AbsoluteLayout.getTop(child)) * density;
            var childRight = childLeft + childWidth + (child.marginLeft + child.marginRight) * density;
            var childBottom = childTop + childHeight + (child.marginTop + child.marginBottom) * density;
            view.View.layoutChild(this, child, childLeft, childTop, childRight, childBottom);
        }
    };
    AbsoluteLayout.leftProperty = new dependencyObservable.Property("left", "AbsoluteLayout", new dependencyObservable.PropertyMetadata(0, undefined, onPropertyChanged, numberUtils.isFiniteNumber));
    AbsoluteLayout.topProperty = new dependencyObservable.Property("top", "AbsoluteLayout", new dependencyObservable.PropertyMetadata(0, undefined, onPropertyChanged, numberUtils.isFiniteNumber));
    return AbsoluteLayout;
})(layouts.Layout);
exports.AbsoluteLayout = AbsoluteLayout;
