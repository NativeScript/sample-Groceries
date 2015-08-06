var utils = require("utils/utils");
var view = require("ui/core/view");
var common = require("ui/layouts/absolute-layout/absolute-layout-common");
global.moduleMerge(common, exports);
var AbsoluteLayout = (function (_super) {
    __extends(AbsoluteLayout, _super);
    function AbsoluteLayout() {
        _super.apply(this, arguments);
    }
    AbsoluteLayout.prototype.onLeftChanged = function (view, oldValue, newValue) {
        this.requestLayout();
    };
    AbsoluteLayout.prototype.onTopChanged = function (view, oldValue, newValue) {
        this.requestLayout();
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
    return AbsoluteLayout;
})(common.AbsoluteLayout);
exports.AbsoluteLayout = AbsoluteLayout;
