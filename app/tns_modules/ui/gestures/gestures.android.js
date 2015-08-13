var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/gestures/gestures-common");
var definition = require("ui/gestures");
var view = require("ui/core/view");
var trace = require("trace");
require("utils/module-merge").merge(common, exports);
var SWIPE_THRESHOLD = 100;
var SWIPE_VELOCITY_THRESHOLD = 100;
var GesturesObserver = (function (_super) {
    __extends(GesturesObserver, _super);
    function GesturesObserver() {
        _super.apply(this, arguments);
    }
    GesturesObserver.prototype.observe = function (type) {
        var _this = this;
        if (this.target) {
            this.type = type;
            this._onTargetLoaded = function (args) {
                trace.write(_this.target + ".target loaded. android:" + _this.target._nativeView, "gestures");
                _this._attach(_this.target, type);
            };
            this._onTargetUnloaded = function (args) {
                trace.write(_this.target + ".target unloaded. android:" + _this.target._nativeView, "gestures");
                _this._dettach();
            };
            this.target.on(view.View.loadedEvent, this._onTargetLoaded);
            this.target.on(view.View.unloadedEvent, this._onTargetUnloaded);
            if (this.target.isLoaded) {
                this._attach(this.target, type);
            }
        }
    };
    GesturesObserver.prototype.disconnect = function () {
        this._dettach();
        if (this.target) {
            this.target.off(view.View.loadedEvent, this._onTargetLoaded);
            this.target.off(view.View.unloadedEvent, this._onTargetUnloaded);
            this._onTargetLoaded = null;
            this._onTargetUnloaded = null;
        }
        _super.prototype.disconnect.call(this);
    };
    GesturesObserver.prototype._dettach = function () {
        trace.write(this.target + "._detach() android:" + this.target._nativeView, "gestures");
        this._onTouchListener = null;
        this._simpleGestureDetector = null;
        this._scaleGestureDetector = null;
        this._swipeGestureDetector = null;
        this._panGestureDetector = null;
    };
    GesturesObserver.prototype._attach = function (target, type) {
        trace.write(this.target + "._attach() android:" + this.target._nativeView, "gestures");
        this._dettach();
        if (type & definition.GestureTypes.tap || type & definition.GestureTypes.doubleTap || type & definition.GestureTypes.longPress) {
            this._simpleGestureDetector = new android.support.v4.view.GestureDetectorCompat(target._context, new TapAndDoubleTapGestureListener(this, this.target, type));
        }
        if (type & definition.GestureTypes.pinch) {
            this._scaleGestureDetector = new android.view.ScaleGestureDetector(target._context, new PinchGestureListener(this, this.target));
        }
        if (type & definition.GestureTypes.swipe) {
            this._swipeGestureDetector = new android.support.v4.view.GestureDetectorCompat(target._context, new SwipeGestureListener(this, this.target));
        }
        if (type & definition.GestureTypes.pan) {
            this._panGestureDetector = new android.support.v4.view.GestureDetectorCompat(target._context, new PanGestureListener(this, this.target));
        }
    };
    GesturesObserver.prototype.androidOnTouchEvent = function (motionEvent) {
        if (this._simpleGestureDetector) {
            this._simpleGestureDetector.onTouchEvent(motionEvent);
        }
        if (this._scaleGestureDetector) {
            this._scaleGestureDetector.onTouchEvent(motionEvent);
        }
        if (this._swipeGestureDetector) {
            this._swipeGestureDetector.onTouchEvent(motionEvent);
        }
        if (this._panGestureDetector) {
            this._panGestureDetector.onTouchEvent(motionEvent);
        }
        if (this.type & definition.GestureTypes.rotation && motionEvent.getPointerCount() === 2) {
            var deltaX = motionEvent.getX(0) - motionEvent.getX(1);
            var deltaY = motionEvent.getY(0) - motionEvent.getY(1);
            var radians = Math.atan(deltaY / deltaX);
            var degrees = radians * (180 / Math.PI);
            var args = {
                type: definition.GestureTypes.rotation,
                view: this.target,
                android: motionEvent,
                rotation: degrees,
                ios: null
            };
            if (this.callback) {
                this.callback.call(this.context, args);
            }
        }
    };
    return GesturesObserver;
})(common.GesturesObserver);
exports.GesturesObserver = GesturesObserver;
function _getArgs(type, view, e) {
    return {
        type: type,
        view: view,
        android: e
    };
}
function _getSwipeArgs(direction, view, initialEvent, currentEvent) {
    return {
        type: definition.GestureTypes.swipe,
        view: view,
        android: { initial: initialEvent, current: currentEvent },
        direction: direction
    };
}
function _getPanArgs(deltaX, deltaY, view, initialEvent, currentEvent) {
    return {
        type: definition.GestureTypes.pan,
        view: view,
        android: { initial: initialEvent, current: currentEvent },
        deltaX: deltaX,
        deltaY: deltaY
    };
}
function _executeCallback(observer, args) {
    if (observer && observer.callback) {
        observer.callback.call(observer._context, args);
    }
}
var TapAndDoubleTapGestureListener = (function (_super) {
    __extends(TapAndDoubleTapGestureListener, _super);
    function TapAndDoubleTapGestureListener(observer, target, type) {
        _super.call(this);
        this._observer = observer;
        this._target = target;
        this._type = type;
        return global.__native(this);
    }
    TapAndDoubleTapGestureListener.prototype.onSingleTapConfirmed = function (motionEvent) {
        if (this._type === definition.GestureTypes.tap) {
            var args = _getArgs(definition.GestureTypes.tap, this._target, motionEvent);
            _executeCallback(this._observer, args);
        }
        return true;
    };
    TapAndDoubleTapGestureListener.prototype.onDoubleTap = function (motionEvent) {
        if (this._type === definition.GestureTypes.doubleTap) {
            var args = _getArgs(definition.GestureTypes.doubleTap, this._target, motionEvent);
            _executeCallback(this._observer, args);
        }
        return true;
    };
    TapAndDoubleTapGestureListener.prototype.onDown = function (motionEvent) {
        return true;
    };
    TapAndDoubleTapGestureListener.prototype.onLongPress = function (motionEvent) {
        if (this._type === definition.GestureTypes.longPress) {
            var args = _getArgs(definition.GestureTypes.longPress, this._target, motionEvent);
            _executeCallback(this._observer, args);
        }
        return true;
    };
    return TapAndDoubleTapGestureListener;
})(android.view.GestureDetector.SimpleOnGestureListener);
var PinchGestureListener = (function (_super) {
    __extends(PinchGestureListener, _super);
    function PinchGestureListener(observer, target) {
        _super.call(this);
        this._observer = observer;
        this._target = target;
        return global.__native(this);
    }
    PinchGestureListener.prototype.onScale = function (detector) {
        var args = {
            type: definition.GestureTypes.pinch,
            view: this._target,
            android: detector,
            scale: detector.getScaleFactor()
        };
        _executeCallback(this._observer, args);
        return true;
    };
    return PinchGestureListener;
})(android.view.ScaleGestureDetector.SimpleOnScaleGestureListener);
var SwipeGestureListener = (function (_super) {
    __extends(SwipeGestureListener, _super);
    function SwipeGestureListener(observer, target) {
        _super.call(this);
        this._observer = observer;
        this._target = target;
        return global.__native(this);
    }
    SwipeGestureListener.prototype.onDown = function (motionEvent) {
        return true;
    };
    SwipeGestureListener.prototype.onFling = function (initialEvent, currentEvent, velocityX, velocityY) {
        var result = false;
        var args;
        try {
            var deltaY = currentEvent.getY() - initialEvent.getY();
            var deltaX = currentEvent.getX() - initialEvent.getX();
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > SWIPE_THRESHOLD
                    && Math.abs(velocityX) > SWIPE_VELOCITY_THRESHOLD) {
                    if (deltaX > 0) {
                        args = _getSwipeArgs(definition.SwipeDirection.right, this._target, initialEvent, currentEvent);
                        _executeCallback(this._observer, args);
                        result = true;
                    }
                    else {
                        args = _getSwipeArgs(definition.SwipeDirection.left, this._target, initialEvent, currentEvent);
                        _executeCallback(this._observer, args);
                        result = true;
                    }
                }
            }
            else {
                if (Math.abs(deltaY) > SWIPE_THRESHOLD
                    && Math.abs(velocityY) > SWIPE_VELOCITY_THRESHOLD) {
                    if (deltaY > 0) {
                        args = _getSwipeArgs(definition.SwipeDirection.down, this._target, initialEvent, currentEvent);
                        _executeCallback(this._observer, args);
                        result = true;
                    }
                    else {
                        args = _getSwipeArgs(definition.SwipeDirection.up, this._target, initialEvent, currentEvent);
                        _executeCallback(this._observer, args);
                        result = true;
                    }
                }
            }
        }
        catch (ex) {
        }
        return result;
    };
    return SwipeGestureListener;
})(android.view.GestureDetector.SimpleOnGestureListener);
var PanGestureListener = (function (_super) {
    __extends(PanGestureListener, _super);
    function PanGestureListener(observer, target) {
        _super.call(this);
        this._observer = observer;
        this._target = target;
        return global.__native(this);
    }
    PanGestureListener.prototype.onDown = function (motionEvent) {
        return false;
    };
    PanGestureListener.prototype.onScroll = function (initialEvent, currentEvent, lastDeltaX, lastDeltaY) {
        var deltaX = currentEvent.getX() - initialEvent.getX();
        var deltaY = currentEvent.getY() - initialEvent.getY();
        var args = _getPanArgs(deltaX, deltaY, this._target, initialEvent, currentEvent);
        _executeCallback(this._observer, args);
        return true;
    };
    return PanGestureListener;
})(android.view.GestureDetector.SimpleOnGestureListener);
