var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var viewCommon = require("ui/core/view-common");
var trace = require("trace");
var utils = require("utils/utils");
var background = require("ui/styling/background");
require("utils/module-merge").merge(viewCommon, exports);
function onIdPropertyChanged(data) {
    var view = data.object;
    if (!view._nativeView) {
        return;
    }
    view._nativeView.accessibilityIdentifier = data.newValue;
}
viewCommon.View.idProperty.metadata.onSetNativeValue = onIdPropertyChanged;
function onIsEnabledPropertyChanged(data) {
    var view = data.object;
    if (!view._nativeView) {
        return;
    }
    if (view._nativeView instanceof UIControl) {
        view._nativeView.enabled = data.newValue;
    }
}
viewCommon.View.isEnabledProperty.metadata.onSetNativeValue = onIsEnabledPropertyChanged;
function onIsUserInteractionEnabledPropertyChanged(data) {
    var view = data.object;
    if (!view._nativeView) {
        return;
    }
    view._nativeView.userInteractionEnabled = data.newValue;
}
viewCommon.View.isUserInteractionEnabledProperty.metadata.onSetNativeValue = onIsUserInteractionEnabledPropertyChanged;
var PFLAG_FORCE_LAYOUT = 1;
var PFLAG_MEASURED_DIMENSION_SET = 1 << 1;
var PFLAG_LAYOUT_REQUIRED = 1 << 2;
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        _super.call(this);
        this._privateFlags = PFLAG_LAYOUT_REQUIRED | PFLAG_FORCE_LAYOUT;
    }
    View.prototype._addViewCore = function (view) {
        _super.prototype._addViewCore.call(this, view);
        this.requestLayout();
    };
    View.prototype._removeViewCore = function (view) {
        _super.prototype._removeViewCore.call(this, view);
        view._onDetached();
        this.requestLayout();
    };
    View.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        utils.copyFrom(this._options, this);
        delete this._options;
    };
    Object.defineProperty(View.prototype, "_nativeView", {
        get: function () {
            return this.ios;
        },
        enumerable: true,
        configurable: true
    });
    View.prototype._prepareNativeView = function (view) {
        view.userInteractionEnabled = true;
    };
    View.prototype.requestLayout = function () {
        _super.prototype.requestLayout.call(this);
        this._privateFlags |= PFLAG_FORCE_LAYOUT;
        if (this.parent) {
            this.parent.requestLayout();
        }
    };
    View.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        var measureSpecsChanged = this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        var forceLayout = (this._privateFlags & PFLAG_FORCE_LAYOUT) === PFLAG_FORCE_LAYOUT;
        if (forceLayout || measureSpecsChanged) {
            this._privateFlags &= ~PFLAG_MEASURED_DIMENSION_SET;
            this.onMeasure(widthMeasureSpec, heightMeasureSpec);
            this._privateFlags |= PFLAG_LAYOUT_REQUIRED;
            if ((this._privateFlags & PFLAG_MEASURED_DIMENSION_SET) !== PFLAG_MEASURED_DIMENSION_SET) {
                throw new Error("onMeasure() did not set the measured dimension by calling setMeasuredDimension()");
            }
        }
    };
    View.prototype.layout = function (left, top, right, bottom) {
        var changed = this._setCurrentLayoutBounds(left, top, right, bottom);
        this.layoutNativeView(left, top, right, bottom);
        if (changed || (this._privateFlags & PFLAG_LAYOUT_REQUIRED) === PFLAG_LAYOUT_REQUIRED) {
            this.onLayout(left, top, right, bottom);
            this._privateFlags &= ~PFLAG_LAYOUT_REQUIRED;
            this._onBoundsChanged();
        }
        this._privateFlags &= ~PFLAG_FORCE_LAYOUT;
    };
    View.prototype.setMeasuredDimension = function (measuredWidth, measuredHeight) {
        _super.prototype.setMeasuredDimension.call(this, measuredWidth, measuredHeight);
        this._privateFlags |= PFLAG_MEASURED_DIMENSION_SET;
    };
    View.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var view = this._nativeView;
        if (view) {
            var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
            var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
            var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
            var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
            if (widthMode === utils.layout.UNSPECIFIED) {
                width = Number.POSITIVE_INFINITY;
            }
            if (heightMode === utils.layout.UNSPECIFIED) {
                height = Number.POSITIVE_INFINITY;
            }
            trace.write(this + " :onMeasure: " + utils.layout.getMode(widthMode) + " " + width + ", " + utils.layout.getMode(heightMode) + " " + height, trace.categories.Layout);
            var nativeSize = view.sizeThatFits(CGSizeMake(width, height));
            var measureWidth = Math.max(nativeSize.width, this.minWidth);
            var measureHeight = Math.max(nativeSize.height, this.minHeight);
            var widthAndState = View.resolveSizeAndState(measureWidth, width, widthMode, 0);
            var heightAndState = View.resolveSizeAndState(measureHeight, height, heightMode, 0);
            this.setMeasuredDimension(widthAndState, heightAndState);
        }
    };
    View.prototype.onLayout = function (left, top, right, bottom) {
        trace.write(this + " :onLayout: " + left + ", " + top + ", " + (right - left) + ", " + (bottom - top), trace.categories.Layout);
    };
    View.prototype.layoutNativeView = function (left, top, right, bottom) {
        if (!this._nativeView) {
            return;
        }
        var frame = CGRectMake(left, top, right - left, bottom - top);
        var nativeView;
        if (!this.parent && this._nativeView.subviews.count > 0 && !this._isModal) {
            trace.write(this + " has no parent. Setting frame to first child instead.", trace.categories.Layout);
            nativeView = this._nativeView.subviews[0];
        }
        else {
            nativeView = this._nativeView;
        }
        if (!CGRectEqualToRect(nativeView.frame, frame)) {
            trace.write(this + ", Native setFrame: = " + NSStringFromCGRect(frame), trace.categories.Layout);
            nativeView.frame = frame;
        }
    };
    View.prototype._updateLayout = function () {
        var oldBounds = this._getCurrentLayoutBounds();
        this.layoutNativeView(oldBounds.left, oldBounds.top, oldBounds.right, oldBounds.bottom);
    };
    View.prototype.focus = function () {
        if (this.ios) {
            return this.ios.becomeFirstResponder();
        }
        return false;
    };
    View.prototype._onBoundsChanged = function () {
        var bgColor = background.ios.createBackgroundUIColor(this);
        if (bgColor) {
            this._nativeView.backgroundColor = bgColor;
        }
    };
    return View;
})(viewCommon.View);
exports.View = View;
var CustomLayoutView = (function (_super) {
    __extends(CustomLayoutView, _super);
    function CustomLayoutView() {
        _super.call(this);
        this._view = new UIView();
        this._view.autoresizesSubviews = false;
    }
    Object.defineProperty(CustomLayoutView.prototype, "ios", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomLayoutView.prototype, "_nativeView", {
        get: function () {
            return this._view;
        },
        enumerable: true,
        configurable: true
    });
    CustomLayoutView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        // Don't call super because it will trigger measure again.
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        trace.write(this + " :onMeasure: " + utils.layout.getMode(widthMode) + " " + width + ", " + utils.layout.getMode(heightMode) + " " + height, trace.categories.Layout);
    };
    CustomLayoutView.prototype._addViewToNativeVisualTree = function (child) {
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (this._nativeView && child._nativeView) {
            this._nativeView.addSubview(child._nativeView);
            return true;
        }
        return false;
    };
    CustomLayoutView.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (child._nativeView) {
            child._nativeView.removeFromSuperview();
        }
    };
    return CustomLayoutView;
})(View);
exports.CustomLayoutView = CustomLayoutView;
