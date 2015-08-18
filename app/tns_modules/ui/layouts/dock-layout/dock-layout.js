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
var enums = require("ui/enums");
var proxy = require("ui/core/proxy");
function isDockValid(value) {
    return value === enums.Dock.left || value === enums.Dock.top || value === enums.Dock.right || value === enums.Dock.bottom;
}
function onDockPropertyChanged(data) {
    var uiView = data.object;
    if (uiView instanceof view.View) {
        var layout = uiView.parent;
        if (layout instanceof DockLayout) {
            layout.requestLayout();
        }
    }
}
var DockLayout = (function (_super) {
    __extends(DockLayout, _super);
    function DockLayout() {
        _super.apply(this, arguments);
    }
    DockLayout.getDock = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(DockLayout.dockProperty);
    };
    DockLayout.setDock = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(DockLayout.dockProperty, value);
    };
    Object.defineProperty(DockLayout.prototype, "stretchLastChild", {
        get: function () {
            return this._getValue(DockLayout.stretchLastChildProperty);
        },
        set: function (value) {
            this._setValue(DockLayout.stretchLastChildProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    DockLayout.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        _super.prototype.onMeasure.call(this, widthMeasureSpec, heightMeasureSpec);
        var measureWidth = 0;
        var measureHeight = 0;
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var density = utils.layout.getDisplayDensity();
        var remainingWidth = widthMode === utils.layout.UNSPECIFIED ? Number.MAX_VALUE : width - ((this.paddingLeft + this.paddingRight) * density);
        var remainingHeight = heightMode === utils.layout.UNSPECIFIED ? Number.MAX_VALUE : height - ((this.paddingTop + this.paddingBottom) * density);
        var tempHeight = 0;
        var tempWidth = 0;
        var childWidthMeasureSpec;
        var childHeightMeasureSpec;
        var count = this.getChildrenCount();
        for (var i = 0; i < count; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }
            if (this.stretchLastChild && i === (count - 1)) {
                childWidthMeasureSpec = utils.layout.makeMeasureSpec(remainingWidth, widthMode);
                childHeightMeasureSpec = utils.layout.makeMeasureSpec(remainingHeight, heightMode);
            }
            else {
                childWidthMeasureSpec = utils.layout.makeMeasureSpec(remainingWidth, widthMode === utils.layout.EXACTLY ? utils.layout.AT_MOST : widthMode);
                childHeightMeasureSpec = utils.layout.makeMeasureSpec(remainingHeight, heightMode === utils.layout.EXACTLY ? utils.layout.AT_MOST : heightMode);
            }
            var childSize = view.View.measureChild(this, child, childWidthMeasureSpec, childHeightMeasureSpec);
            var dock = DockLayout.getDock(child);
            switch (dock) {
                case enums.Dock.top:
                case enums.Dock.bottom:
                    remainingHeight = Math.max(0, remainingHeight - childSize.measuredHeight);
                    tempHeight += childSize.measuredHeight;
                    measureWidth = Math.max(measureWidth, tempWidth + childSize.measuredWidth);
                    measureHeight = Math.max(measureHeight, tempHeight);
                    break;
                case enums.Dock.left:
                case enums.Dock.right:
                default:
                    remainingWidth = Math.max(0, remainingWidth - childSize.measuredWidth);
                    tempWidth += childSize.measuredWidth;
                    measureWidth = Math.max(measureWidth, tempWidth);
                    measureHeight = Math.max(measureHeight, tempHeight + childSize.measuredHeight);
                    break;
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
    DockLayout.prototype.onLayout = function (left, top, right, bottom) {
        _super.prototype.onLayout.call(this, left, top, right, bottom);
        var density = utils.layout.getDisplayDensity();
        var childLeft = this.paddingLeft * density;
        var childTop = this.paddingTop * density;
        var x = childLeft;
        var y = childTop;
        var remainingWidth = Math.max(0, right - left - ((this.paddingLeft + this.paddingRight) * density));
        var remainingHeight = Math.max(0, bottom - top - ((this.paddingTop + this.paddingBottom) * density));
        var count = this.getChildrenCount();
        var childToStretch = null;
        if (count > 0 && this.stretchLastChild) {
            count--;
            childToStretch = this.getChildAt(count);
        }
        for (var i = 0; i < count; i++) {
            var child = this.getChildAt(i);
            if (!child || !child._isVisible) {
                continue;
            }
            var childWidth = child.getMeasuredWidth() + (child.marginLeft + child.marginRight) * density;
            var childHeight = child.getMeasuredHeight() + (child.marginTop + child.marginBottom) * density;
            var dock = DockLayout.getDock(child);
            switch (dock) {
                case enums.Dock.top:
                    childLeft = x;
                    childTop = y;
                    childWidth = remainingWidth;
                    y += childHeight;
                    remainingHeight = Math.max(0, remainingHeight - childHeight);
                    break;
                case enums.Dock.bottom:
                    childLeft = x;
                    childTop = y + remainingHeight - childHeight;
                    childWidth = remainingWidth;
                    remainingHeight = Math.max(0, remainingHeight - childHeight);
                    break;
                case enums.Dock.right:
                    childLeft = x + remainingWidth - childWidth;
                    childTop = y;
                    childHeight = remainingHeight;
                    remainingWidth = Math.max(0, remainingWidth - childWidth);
                    break;
                case enums.Dock.left:
                default:
                    childLeft = x;
                    childTop = y;
                    childHeight = remainingHeight;
                    x += childWidth;
                    remainingWidth = Math.max(0, remainingWidth - childWidth);
                    break;
            }
            view.View.layoutChild(this, child, childLeft, childTop, childLeft + childWidth, childTop + childHeight);
        }
        if (childToStretch) {
            view.View.layoutChild(this, childToStretch, x, y, x + remainingWidth, y + remainingHeight);
        }
    };
    DockLayout.dockProperty = new dependencyObservable.Property("dock", "DockLayout", new dependencyObservable.PropertyMetadata(enums.Dock.left, undefined, onDockPropertyChanged, isDockValid));
    DockLayout.stretchLastChildProperty = new dependencyObservable.Property("stretchLastChild", "DockLayout", new proxy.PropertyMetadata(true, dependencyObservable.PropertyMetadataSettings.AffectsLayout));
    return DockLayout;
})(layouts.Layout);
exports.DockLayout = DockLayout;
