var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");
var contentView = require("ui/content-view");
var common = require("ui/scroll-view/scroll-view-common");
var utils = require("utils/utils");
var enums = require("ui/enums");
require("utils/module-merge").merge(common, exports);
var OWNER = "_owner";
var STATE = "_scrollViewState";
common.orientationProperty.metadata.onValueChanged = function scrollViewOrientationChanged(data) {
    data.object._onOrientationChanged(data.oldValue, data.newValue);
};
function onMeasureScrollView(widthMeasureSpec, heightMeasureSpec) {
    var owner = this.owner;
    owner.onMeasure(widthMeasureSpec, heightMeasureSpec);
    this.setMeasuredDimension(owner.getMeasuredWidth(), owner.getMeasuredHeight());
}
function onLayoutScrollView(changed, left, top, right, bottom) {
    var owner = this.owner;
    owner.onLayout(left, top, right, bottom);
    var state = owner[STATE];
    if (state) {
        this.scrollTo(state.scrollX, state.scrollY);
        delete owner[STATE];
    }
}
function onSaveInstanceStateNative() {
    var state = {
        scrollX: this.getScrollX(),
        scrollY: this.getScrollY()
    };
    this.owner[STATE] = state;
    return this.super.onSaveInstanceState();
}
var NativeVerticalScrollView = (function (_super) {
    __extends(NativeVerticalScrollView, _super);
    function NativeVerticalScrollView(ctx) {
        _super.call(this, ctx);
        return global.__native(this);
    }
    Object.defineProperty(NativeVerticalScrollView.prototype, "owner", {
        get: function () {
            return this[OWNER];
        },
        enumerable: true,
        configurable: true
    });
    NativeVerticalScrollView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        onMeasureScrollView.apply(this, [widthMeasureSpec, heightMeasureSpec]);
    };
    NativeVerticalScrollView.prototype.onLayout = function (changed, left, top, right, bottom) {
        onLayoutScrollView.apply(this, [changed, left, top, right, bottom]);
    };
    NativeVerticalScrollView.prototype.onSaveInstanceState = function () {
        onSaveInstanceStateNative.apply(this, []);
    };
    return NativeVerticalScrollView;
})(android.widget.ScrollView);
;
var NativeHorizontalScrollView = (function (_super) {
    __extends(NativeHorizontalScrollView, _super);
    function NativeHorizontalScrollView(ctx) {
        _super.call(this, ctx);
        return global.__native(this);
    }
    Object.defineProperty(NativeHorizontalScrollView.prototype, "owner", {
        get: function () {
            return this[OWNER];
        },
        enumerable: true,
        configurable: true
    });
    NativeHorizontalScrollView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        onMeasureScrollView.apply(this, [widthMeasureSpec, heightMeasureSpec]);
    };
    NativeHorizontalScrollView.prototype.onLayout = function (changed, left, top, right, bottom) {
        onLayoutScrollView.apply(this, [changed, left, top, right, bottom]);
    };
    NativeHorizontalScrollView.prototype.onSaveInstanceState = function () {
        onSaveInstanceStateNative.apply(this, []);
    };
    return NativeHorizontalScrollView;
})(android.widget.HorizontalScrollView);
;
var ScrollView = (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        _super.apply(this, arguments);
        this._contentMeasuredWidth = 0;
        this._contentMeasuredHeight = 0;
        this._scrollableLength = 0;
    }
    Object.defineProperty(ScrollView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "_nativeView", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
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
            if (!this._android) {
                return 0;
            }
            return this._android.getScrollX() / utils.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "verticalOffset", {
        get: function () {
            if (!this._android) {
                return 0;
            }
            return this._android.getScrollY() / utils.layout.getDisplayDensity();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableWidth", {
        get: function () {
            if (!this._android || this.orientation !== enums.Orientation.horizontal) {
                return 0;
            }
            return this._scrollableLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollableHeight", {
        get: function () {
            if (!this._android || this.orientation !== enums.Orientation.vertical) {
                return 0;
            }
            return this._scrollableLength;
        },
        enumerable: true,
        configurable: true
    });
    ScrollView.prototype.scrollToVerticalOffset = function (value, animated) {
        if (this._android && this.orientation === enums.Orientation.vertical) {
            value *= utils.layout.getDisplayDensity();
            var scrollView = this._android;
            if (animated) {
                scrollView.smoothScrollTo(0, value);
            }
            else {
                scrollView.scrollTo(0, value);
            }
        }
    };
    ScrollView.prototype.scrollToHorizontalOffset = function (value, animated) {
        if (this._android && this.orientation === enums.Orientation.horizontal) {
            value *= utils.layout.getDisplayDensity();
            var scrollView = this._android;
            if (animated) {
                scrollView.smoothScrollTo(value, 0);
            }
            else {
                scrollView.scrollTo(value, 0);
            }
        }
    };
    ScrollView.prototype._createUI = function () {
        if (this.orientation === enums.Orientation.horizontal) {
            this._android = new NativeHorizontalScrollView(this._context);
        }
        else {
            this._android = new NativeVerticalScrollView(this._context);
        }
        if (!this._androidViewId) {
            this._androidViewId = android.view.View.generateViewId();
        }
        this._android.setId(this._androidViewId);
        this._android[OWNER] = this;
    };
    ScrollView.prototype._onOrientationChanged = function (oldValue, newValue) {
        if (this._android) {
            var parent = this.parent;
            if (parent) {
                parent._removeView(this);
            }
            if (parent) {
                parent._addView(this);
            }
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
            this._scrollableLength = 0;
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
            this._scrollableLength = this._contentMeasuredWidth - width;
            view.View.layoutChild(this, this.content, 0, 0, Math.max(this._contentMeasuredWidth, width), height);
        }
        else {
            this._scrollableLength = this._contentMeasuredHeight - height;
            view.View.layoutChild(this, this.content, 0, 0, width, Math.max(this._contentMeasuredHeight, height));
        }
        this._scrollableLength /= utils.layout.getDisplayDensity();
        this._scrollableLength = Math.max(0, this._scrollableLength);
    };
    return ScrollView;
})(contentView.ContentView);
exports.ScrollView = ScrollView;
