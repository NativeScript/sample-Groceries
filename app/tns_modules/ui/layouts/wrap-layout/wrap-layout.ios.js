var utils = require("utils/utils");
var view = require("ui/core/view");
var enums = require("ui/enums");
var common = require("ui/layouts/wrap-layout/wrap-layout-common");
global.moduleMerge(common, exports);
var WrapLayout = (function (_super) {
    __extends(WrapLayout, _super);
    function WrapLayout() {
        _super.apply(this, arguments);
    }
    WrapLayout.getChildMeasureSpec = function (parentMode, parentLength, itemLength) {
        if (itemLength > 0) {
            return utils.layout.makeMeasureSpec(itemLength, utils.layout.EXACTLY);
        }
        else if (parentMode === utils.layout.UNSPECIFIED) {
            return utils.layout.makeMeasureSpec(0, utils.layout.UNSPECIFIED);
        }
        else {
            return utils.layout.makeMeasureSpec(parentLength, utils.layout.AT_MOST);
        }
    };
    WrapLayout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        _super.prototype.onMeasure.call(this, widthMeasureSpec, heightMeasureSpec);
        var measureWidth = 0;
        var measureHeight = 0;
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var count = this.getChildrenCount();
        var density = utils.layout.getDisplayDensity();
        var childWidthMeasureSpec = WrapLayout.getChildMeasureSpec(widthMode, width, this.itemWidth * density);
        var childHeightMeasureSpec = WrapLayout.getChildMeasureSpec(heightMode, height, this.itemHeight * density);
        var remainingWidth = widthMode === utils.layout.UNSPECIFIED ? Number.MAX_VALUE : width - ((this.paddingLeft + this.paddingRight) * density);
        var remainingHeight = heightMode === utils.layout.UNSPECIFIED ? Number.MAX_VALUE : height - ((this.paddingTop + this.paddingBottom) * density);
        this._lenghts = [0];
        var rowOrColumn = 0;
        var maxLenght = 0;
        var i = 0;
        var isVertical = this.orientation === enums.Orientation.vertical;
        for (i = 0; i < count; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }
            var childSize = view.View.measureChild(this, child, childWidthMeasureSpec, childHeightMeasureSpec);
            if (isVertical) {
                if (childSize.measuredHeight > remainingHeight) {
                    rowOrColumn++;
                    maxLenght = Math.max(maxLenght, measureHeight);
                    measureHeight = childSize.measuredHeight;
                    remainingWidth = height - childSize.measuredHeight;
                    this._lenghts[rowOrColumn] = childSize.measuredWidth;
                }
                else {
                    remainingHeight -= childSize.measuredHeight;
                    this._lenghts[rowOrColumn] = Math.max(this._lenghts[rowOrColumn], childSize.measuredWidth);
                    measureHeight += childSize.measuredHeight;
                }
            }
            else {
                if (childSize.measuredWidth > remainingWidth) {
                    rowOrColumn++;
                    maxLenght = Math.max(maxLenght, measureWidth);
                    measureWidth = childSize.measuredWidth;
                    remainingWidth = width - childSize.measuredWidth;
                    this._lenghts[rowOrColumn] = childSize.measuredHeight;
                }
                else {
                    remainingWidth -= childSize.measuredWidth;
                    this._lenghts[rowOrColumn] = Math.max(this._lenghts[rowOrColumn], childSize.measuredHeight);
                    measureWidth += childSize.measuredWidth;
                }
            }
        }
        if (isVertical) {
            measureHeight = Math.max(maxLenght, measureHeight);
            for (i = 0; i < this._lenghts.length; i++) {
                measureWidth += this._lenghts[i];
            }
        }
        else {
            measureWidth = Math.max(maxLenght, measureWidth);
            for (i = 0; i < this._lenghts.length; i++) {
                measureHeight += this._lenghts[i];
            }
        }
        measureWidth += (this.paddingLeft + this.paddingRight) * density;
        measureHeight += (this.paddingTop + this.paddingBottom) * density;
        measureWidth = Math.max(measureWidth, this.minWidth * density);
        measureHeight = Math.max(measureHeight, this.minHeight * density);
        var widthAndState = view.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    WrapLayout.prototype.onLayout = function (left, top, right, bottom) {
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        var isVertical = this.orientation === enums.Orientation.vertical;
        var density = utils.layout.getDisplayDensity();
        var count = this.getChildrenCount();
        var childLeft = this.paddingLeft * density;
        var childTop = this.paddingTop * density;
        var childrenLength;
        if (isVertical) {
            childrenLength = bottom - top - (this.paddingTop + this.paddingBottom) * density;
        }
        else {
            childrenLength = right - left - (this.paddingLeft + this.paddingRight) * density;
        }
        var rowOrColumn = 0;
        for (var i = 0; i < count; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }
            var childWidth = child.getMeasuredWidth() + (child.marginLeft + child.marginRight) * density;
            var childHeight = child.getMeasuredHeight() + (child.marginTop + child.marginBottom) * density;
            var length = this._lenghts[rowOrColumn];
            if (isVertical) {
                childWidth = length;
                childHeight = this.itemHeight > 0 ? this.itemHeight * density : childHeight;
                if (childTop + childHeight > childrenLength) {
                    childTop = this.paddingTop * density;
                    childLeft += length;
                    rowOrColumn++;
                    childWidth = length = this._lenghts[rowOrColumn];
                }
            }
            else {
                childWidth = this.itemWidth > 0 ? this.itemWidth * density : childWidth;
                childHeight = length;
                if (childLeft + childWidth > childrenLength) {
                    childLeft = this.paddingLeft * density;
                    childTop += length;
                    rowOrColumn++;
                    childHeight = length = this._lenghts[rowOrColumn];
                }
            }
            view.View.layoutChild(this, child, childLeft, childTop, childLeft + childWidth, childTop + childHeight);
            if (isVertical) {
                childTop += childHeight;
            }
            else {
                childLeft += childWidth;
            }
        }
    };
    return WrapLayout;
})(common.WrapLayout);
exports.WrapLayout = WrapLayout;
