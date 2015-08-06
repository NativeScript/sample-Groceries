var view = require("ui/core/view");
var contentView = require("ui/content-view");
var common = require("ui/scroll-view/scroll-view-common");
var enums = require("ui/enums");
var utils = require("utils/utils");
global.moduleMerge(common, exports);
var ScrollView = (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        _super.call(this);
        this._contentMeasuredWidth = 0;
        this._contentMeasuredHeight = 0;
        this._scroll = new UIScrollView();
    }
    Object.defineProperty(ScrollView.prototype, "orientation", {
        get: function () {
            return this._getValue(common.orientationProperty);
        },
        set: function (value) {
            this._setValue(common.orientationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "horizontalOffset", {
        get: function () {
            return this._scroll.contentOffset.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "verticalOffset", {
        get: function () {
            return this._scroll.contentOffset.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableWidth", {
        get: function () {
            if (this.orientation !== enums.Orientation.horizontal) {
                return 0;
            }
            return Math.max(0, this._scroll.contentSize.width - this._scroll.bounds.size.width);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableHeight", {
        get: function () {
            if (this.orientation !== enums.Orientation.vertical) {
                return 0;
            }
            return Math.max(0, this._scroll.contentSize.height - this._scroll.bounds.size.height);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "ios", {
        get: function () {
            return this._scroll;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "_nativeView", {
        get: function () {
            return this._scroll;
        },
        enumerable: true,
        configurable: true
    });
    ScrollView.prototype.scrollToVerticalOffset = function (value, animated) {
        if (this.orientation === enums.Orientation.vertical) {
            var bounds = this._scroll.bounds.size;
            this._scroll.scrollRectToVisibleAnimated(CGRectMake(0, value, bounds.width, bounds.height), animated);
        }
    };
    ScrollView.prototype.scrollToHorizontalOffset = function (value, animated) {
        if (this.orientation === enums.Orientation.horizontal) {
            var bounds = this._scroll.bounds.size;
            this._scroll.scrollRectToVisibleAnimated(CGRectMake(value, 0, bounds.width, bounds.height), animated);
        }
    };
    ScrollView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var density = utils.layout.getDisplayDensity();
        var child = this.content;
        if (!child) {
            this._contentMeasuredWidth = this.minWidth * density;
            this._contentMeasuredHeight = this.minHeight * density;
        }
        else {
            var childSize;
            if (this.orientation === enums.Orientation.vertical) {
                childSize = view.View.measureChild(this, child, widthMeasureSpec, utils.layout.makeMeasureSpec(0, utils.layout.UNSPECIFIED));
            }
            else {
                childSize = view.View.measureChild(this, child, utils.layout.makeMeasureSpec(0, utils.layout.UNSPECIFIED), heightMeasureSpec);
            }
            this._scroll.contentSize = CGSizeMake(childSize.measuredWidth, childSize.measuredHeight);
            this._contentMeasuredWidth = Math.max(childSize.measuredWidth, this.minWidth * density);
            this._contentMeasuredHeight = Math.max(childSize.measuredHeight, this.minHeight * density);
        }
        var widthAndState = view.View.resolveSizeAndState(this._contentMeasuredWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(this._contentMeasuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    ScrollView.prototype.onLayout = function (left, top, right, bottom) {
        var width = (right - left);
        var height = (bottom - top);
        if (this.orientation === enums.Orientation.horizontal) {
            view.View.layoutChild(this, this.content, 0, 0, Math.max(this._contentMeasuredWidth, width), height);
        }
        else {
            view.View.layoutChild(this, this.content, 0, 0, width, Math.max(this._contentMeasuredHeight, height));
        }
    };
    return ScrollView;
})(contentView.ContentView);
exports.ScrollView = ScrollView;
