var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var layouts = require("ui/layouts/layout");
var utils = require("utils/utils");
var dependencyObservable = require("ui/core/dependency-observable");
var enums = require("ui/enums");
var proxy = require("ui/core/proxy");
var view = require("ui/core/view");
function validateOrientation(value) {
    return value === enums.Orientation.vertical || value === enums.Orientation.horizontal;
}
exports.orientationProperty = new dependencyObservable.Property("orientation", "StackLayout", new proxy.PropertyMetadata(enums.Orientation.vertical, dependencyObservable.PropertyMetadataSettings.AffectsLayout, undefined, validateOrientation));
var StackLayout = (function (_super) {
    __extends(StackLayout, _super);
    function StackLayout() {
        _super.apply(this, arguments);
        this._totalLength = 0;
    }
    Object.defineProperty(StackLayout.prototype, "orientation", {
        get: function () {
            return this._getValue(exports.orientationProperty);
        },
        set: function (value) {
            this._setValue(exports.orientationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    StackLayout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        _super.prototype.onMeasure.call(this, widthMeasureSpec, heightMeasureSpec);
        var density = utils.layout.getDisplayDensity();
        var measureWidth = 0;
        var measureHeight = 0;
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var isVertical = this.orientation === enums.Orientation.vertical;
        var verticalPadding = (this.paddingTop + this.paddingBottom) * density;
        var horizontalPadding = (this.paddingLeft + this.paddingRight) * density;
        var count = this.getChildrenCount();
        var measureSpec;
        var mode = isVertical ? heightMode : widthMode;
        var remainingLength;
        if (mode === utils.layout.UNSPECIFIED) {
            measureSpec = utils.layout.UNSPECIFIED;
            remainingLength = 0;
        }
        else {
            measureSpec = utils.layout.AT_MOST;
            remainingLength = isVertical ? height - verticalPadding : width - horizontalPadding;
        }
        var childMeasureSpec;
        if (isVertical) {
            var childWidth = (widthMode === utils.layout.UNSPECIFIED) ? 0 : width - horizontalPadding;
            childWidth = Math.max(0, childWidth);
            childMeasureSpec = utils.layout.makeMeasureSpec(childWidth, widthMode);
        }
        else {
            var childHeight = (heightMode === utils.layout.UNSPECIFIED) ? 0 : height - verticalPadding;
            childHeight = Math.max(0, childHeight);
            childMeasureSpec = utils.layout.makeMeasureSpec(childHeight, heightMode);
        }
        var childSize;
        for (var i = 0; i < count; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }
            if (isVertical) {
                childSize = view.View.measureChild(this, child, childMeasureSpec, utils.layout.makeMeasureSpec(remainingLength, measureSpec));
                measureWidth = Math.max(measureWidth, childSize.measuredWidth);
                var viewHeight = childSize.measuredHeight;
                measureHeight += viewHeight;
                remainingLength = Math.max(0, remainingLength - viewHeight);
            }
            else {
                childSize = view.View.measureChild(this, child, utils.layout.makeMeasureSpec(remainingLength, measureSpec), childMeasureSpec);
                measureHeight = Math.max(measureHeight, childSize.measuredHeight);
                var viewWidth = childSize.measuredWidth;
                measureWidth += viewWidth;
                remainingLength = Math.max(0, remainingLength - viewWidth);
            }
        }
        measureWidth += horizontalPadding;
        measureHeight += verticalPadding;
        measureWidth = Math.max(measureWidth, this.minWidth * density);
        measureHeight = Math.max(measureHeight, this.minHeight * density);
        this._totalLength = isVertical ? measureHeight : measureWidth;
        var widthAndState = view.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    StackLayout.prototype.onLayout = function (left, top, right, bottom) {
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        if (this.orientation === enums.Orientation.vertical) {
            this.layoutVertical(left, top, right, bottom);
        }
        else {
            this.layoutHorizontal(left, top, right, bottom);
        }
    };
    StackLayout.prototype.layoutVertical = function (left, top, right, bottom) {
        var density = utils.layout.getDisplayDensity();
        var paddingLeft = this.paddingLeft * density;
        var paddingRight = this.paddingRight * density;
        var paddingTop = this.paddingTop * density;
        var paddingBottom = this.paddingBottom * density;
        var childTop;
        var childLeft = paddingLeft;
        var childRight = right - left - paddingRight;
        switch (this.verticalAlignment) {
            case enums.VerticalAlignment.center:
                childTop = (bottom - top - this._totalLength) / 2 + paddingTop - paddingBottom;
                break;
            case enums.VerticalAlignment.bottom:
                childTop = bottom - top - this._totalLength + paddingTop - paddingBottom;
                break;
            case enums.VerticalAlignment.top:
            case enums.VerticalAlignment.stretch:
            default:
                childTop = paddingTop;
                break;
        }
        var count = this.getChildrenCount();
        for (var i = 0; i < count; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }
            var childHeight = child.getMeasuredHeight() + (child.marginTop + child.marginBottom) * density;
            view.View.layoutChild(this, child, childLeft, childTop, childRight, childTop + childHeight);
            childTop += childHeight;
        }
    };
    StackLayout.prototype.layoutHorizontal = function (left, top, right, bottom) {
        var density = utils.layout.getDisplayDensity();
        var paddingLeft = this.paddingLeft * density;
        var paddingRight = this.paddingRight * density;
        var paddingTop = this.paddingTop * density;
        var paddingBottom = this.paddingBottom * density;
        var childTop = paddingTop;
        var childLeft;
        var childBottom = bottom - top - paddingBottom;
        switch (this.horizontalAlignment) {
            case enums.HorizontalAlignment.center:
                childLeft = (right - left - this._totalLength) / 2 + paddingLeft - paddingRight;
                break;
            case enums.HorizontalAlignment.right:
                childLeft = right - left - this._totalLength + paddingLeft - paddingRight;
                break;
            case enums.HorizontalAlignment.left:
            case enums.HorizontalAlignment.stretch:
            default:
                childLeft = paddingLeft;
                break;
        }
        var count = this.getChildrenCount();
        for (var i = 0; i < count; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }
            var childWidth = child.getMeasuredWidth() + (child.marginLeft + child.marginRight) * density;
            ;
            view.View.layoutChild(this, child, childLeft, childTop, childLeft + childWidth, childBottom);
            childLeft += childWidth;
        }
    };
    return StackLayout;
})(layouts.Layout);
exports.StackLayout = StackLayout;
