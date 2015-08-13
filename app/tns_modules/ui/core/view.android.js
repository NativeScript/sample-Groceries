var viewCommon = require("ui/core/view-common");
var trace = require("trace");
var utils = require("utils/utils");
var gestures = require("ui/gestures");
var types = require("utils/types");
global.moduleMerge(viewCommon, exports);
var ANDROID = "_android";
var NATIVE_VIEW = "_nativeView";
var VIEW_GROUP = "_viewGroup";
var OWNER = "_owner";
function onIdPropertyChanged(data) {
    var view = data.object;
    view._nativeView.setTag(data.newValue);
}
viewCommon.View.idProperty.metadata.onSetNativeValue = onIdPropertyChanged;
function onIsEnabledPropertyChanged(data) {
    var view = data.object;
    view._nativeView.setEnabled(data.newValue);
}
viewCommon.View.isEnabledProperty.metadata.onSetNativeValue = onIsEnabledPropertyChanged;
function onIsUserInteractionEnabledPropertyChanged(data) {
    var view = data.object;
    view._updateOnTouchListener(data.newValue);
}
viewCommon.View.isUserInteractionEnabledProperty.metadata.onSetNativeValue = onIsUserInteractionEnabledPropertyChanged;
exports.NativeViewGroup = android.view.ViewGroup.extend({
    onMeasure: function (widthMeasureSpec, heightMeasureSpec) {
        var owner = this[OWNER];
        owner.onMeasure(widthMeasureSpec, heightMeasureSpec);
        this.setMeasuredDimension(owner.getMeasuredWidth(), owner.getMeasuredHeight());
    },
    onLayout: function (changed, left, top, right, bottom) {
        var owner = this[OWNER];
        owner.onLayout(left, top, right, bottom);
    }
});
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        _super.apply(this, arguments);
        this._disableUserInteractionListener = new android.view.View.OnTouchListener({
            onTouch: function (view, event) {
                return true;
            }
        });
    }
    View.prototype._updateOnTouchListener = function (isUserInteractionEnabled) {
        if (!isUserInteractionEnabled) {
            this._nativeView.setOnTouchListener(this._disableUserInteractionListener);
            return;
        }
        if (this._gesturesListener) {
            this._nativeView.setOnTouchListener(this._gesturesListener);
            return;
        }
        this._nativeView.setOnTouchListener(null);
    };
    Object.defineProperty(View.prototype, "gesturesListener", {
        set: function (value) {
            this._gesturesListener = value;
            this._updateOnTouchListener(this.isUserInteractionEnabled);
        },
        enumerable: true,
        configurable: true
    });
    View.prototype.observe = function (type, callback, thisArg) {
        _super.prototype.observe.call(this, type, callback, thisArg);
        if (this.isLoaded && !this.touchListenerIsSet) {
            this.setOnTouchListener();
        }
    };
    View.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.setOnTouchListener();
    };
    View.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        if (this._nativeView && this._nativeView.setOnTouchListener) {
            this._nativeView.setOnTouchListener(null);
            this.touchListenerIsSet = false;
        }
    };
    View.prototype.hasGestureObservers = function () {
        return this._gestureObservers ? this._gestureObservers.size > 0 : false;
    };
    View.prototype.setOnTouchListener = function () {
        if (this._nativeView && this._nativeView.setOnTouchListener && this.hasGestureObservers()) {
            this.touchListenerIsSet = true;
            var that = new WeakRef(this);
            if (this._nativeView.setClickable) {
                this._nativeView.setClickable(true);
            }
            this._nativeView.setOnTouchListener(new android.view.View.OnTouchListener({
                onTouch: function (view, motionEvent) {
                    var owner = that.get();
                    if (!owner) {
                        return false;
                    }
                    var i;
                    for (var gestType in gestures.GestureTypes) {
                        if (gestures.GestureTypes.hasOwnProperty(gestType) && typeof gestures.GestureTypes[gestType] === "number") {
                            var gestArray = owner.getGestureObservers(parseInt(gestures.GestureTypes[gestType]));
                            if (gestArray) {
                                for (i = 0; i < gestArray.length; i++) {
                                    var gestObserver = gestArray[i];
                                    gestObserver.androidOnTouchEvent(motionEvent);
                                }
                            }
                        }
                    }
                    return owner._nativeView.onTouchEvent(motionEvent);
                }
            }));
        }
    };
    View.prototype._addViewCore = function (view) {
        if (this._context) {
            view._onAttached(this._context);
        }
        _super.prototype._addViewCore.call(this, view);
    };
    View.prototype._removeViewCore = function (view) {
        _super.prototype._removeViewCore.call(this, view);
        view._onDetached();
    };
    View.prototype._onAttached = function (context) {
        if (!context) {
            throw new Error("Expected valid android.content.Context instance.");
        }
        trace.write("calling _onAttached on view " + this._domId, trace.categories.VisualTreeEvents);
        if (this._context === context) {
            return;
        }
        if (this._context) {
            this._onDetached();
        }
        this._context = context;
        this._onContextChanged();
        trace.notifyEvent(this, "_onAttached");
        if (this._childrenCount > 0) {
            var that = this;
            var eachChild = function (child) {
                child._onAttached(context);
                if (!child._isAddedToNativeVisualTree) {
                    child._isAddedToNativeVisualTree = that._addViewToNativeVisualTree(child);
                }
                return true;
            };
            this._eachChildView(eachChild);
        }
    };
    View.prototype._onDetached = function (force) {
        if (this._childrenCount > 0) {
            var that = this;
            var eachChild = function (child) {
                if (child._isAddedToNativeVisualTree) {
                    that._removeViewFromNativeVisualTree(child);
                }
                child._onDetached(force);
                return true;
            };
            this._eachChildView(eachChild);
        }
        trace.write("calling _onDetached on view " + this._domId, trace.categories.VisualTreeEvents);
        this._clearAndroidReference();
        this._context = undefined;
        trace.notifyEvent(this, "_onDetached");
    };
    View.prototype._clearAndroidReference = function () {
        if (this[NATIVE_VIEW] === this[ANDROID]) {
            this[NATIVE_VIEW] = undefined;
        }
        if (this[VIEW_GROUP] === this[ANDROID]) {
            this[VIEW_GROUP] = undefined;
        }
        this[ANDROID] = undefined;
    };
    View.prototype._onContextChanged = function () {
        trace.write("calling _onContextChanged on view " + this._domId, trace.categories.VisualTreeEvents);
        this._createUI();
        utils.copyFrom(this._options, this);
        delete this._options;
        this._syncNativeProperties();
        trace.notifyEvent(this, "_onContextChanged");
    };
    Object.defineProperty(View.prototype, "_nativeView", {
        get: function () {
            return this.android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "isLayoutValid", {
        get: function () {
            if (this._nativeView) {
                return !this._nativeView.isLayoutRequested();
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    View.prototype.layoutNativeView = function (left, top, right, bottom) {
        if (this._nativeView) {
            this._nativeView.layout(left, top, right, bottom);
        }
    };
    View.prototype.requestLayout = function () {
        _super.prototype.requestLayout.call(this);
        if (this._nativeView) {
            return this._nativeView.requestLayout();
        }
    };
    View.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        _super.prototype.measure.call(this, widthMeasureSpec, heightMeasureSpec);
        this.onMeasure(widthMeasureSpec, heightMeasureSpec);
    };
    View.prototype.layout = function (left, top, right, bottom) {
        _super.prototype.layout.call(this, left, top, right, bottom);
        this.onLayout(left, top, right, bottom);
    };
    View.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var view = this._nativeView;
        if (view) {
            var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
            var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
            var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
            var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
            trace.write(this + " :onMeasure: " + utils.layout.getMode(widthMode) + " " + width + ", " + utils.layout.getMode(heightMode) + " " + height, trace.categories.Layout);
            view.measure(widthMeasureSpec, heightMeasureSpec);
            this.setMeasuredDimension(view.getMeasuredWidth(), view.getMeasuredHeight());
        }
    };
    View.prototype.onLayout = function (left, top, right, bottom) {
        var view = this._nativeView;
        if (view) {
            this.layoutNativeView(left, top, right, bottom);
            trace.write(this + " :onLayout: " + left + ", " + top + ", " + (right - left) + ", " + (bottom - top), trace.categories.Layout);
        }
    };
    View.prototype._getCurrentLayoutBounds = function () {
        if (this._nativeView) {
            return {
                left: this._nativeView.getLeft(),
                top: this._nativeView.getTop(),
                right: this._nativeView.getRight(),
                bottom: this._nativeView.getBottom()
            };
        }
        return _super.prototype._getCurrentLayoutBounds.call(this);
    };
    View.prototype.getMeasuredWidth = function () {
        if (this._nativeView) {
            return this._nativeView.getMeasuredWidth();
        }
        return _super.prototype.getMeasuredWidth.call(this);
    };
    View.prototype.getMeasuredHeight = function () {
        if (this._nativeView) {
            return this._nativeView.getMeasuredHeight();
        }
        return _super.prototype.getMeasuredHeight.call(this);
    };
    View.prototype.focus = function () {
        if (this._nativeView) {
            return this._nativeView.requestFocus();
        }
        return false;
    };
    View.resolveSizeAndState = function (size, specSize, specMode, childMeasuredState) {
        var result = size;
        switch (specMode) {
            case utils.layout.UNSPECIFIED:
                result = size;
                break;
            case utils.layout.AT_MOST:
                if (specSize < size) {
                    result = specSize | utils.layout.MEASURED_STATE_TOO_SMALL;
                }
                break;
            case utils.layout.EXACTLY:
                result = specSize;
                break;
        }
        return result | (childMeasuredState & utils.layout.MEASURED_STATE_MASK);
    };
    return View;
})(viewCommon.View);
exports.View = View;
var CustomLayoutView = (function (_super) {
    __extends(CustomLayoutView, _super);
    function CustomLayoutView() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(CustomLayoutView.prototype, "android", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomLayoutView.prototype, "_nativeView", {
        get: function () {
            return this._viewGroup;
        },
        enumerable: true,
        configurable: true
    });
    CustomLayoutView.prototype._createUI = function () {
        this._viewGroup = new org.nativescript.widgets.ContentLayout(this._context);
    };
    CustomLayoutView.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (this._nativeView && child._nativeView) {
            if (types.isNullOrUndefined(atIndex) || atIndex >= this._nativeView.getChildCount()) {
                this._nativeView.addView(child._nativeView);
            }
            else {
                this._nativeView.addView(child._nativeView, atIndex);
            }
            return true;
        }
        return false;
    };
    CustomLayoutView.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (this._nativeView && child._nativeView) {
            this._nativeView.removeView(child._nativeView);
            trace.notifyEvent(child, "childInLayoutRemovedFromNativeVisualTree");
        }
    };
    return CustomLayoutView;
})(View);
exports.CustomLayoutView = CustomLayoutView;
