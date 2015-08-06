var view = require("ui/core/view");
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var LayoutBase = (function (_super) {
    __extends(LayoutBase, _super);
    function LayoutBase() {
        _super.apply(this, arguments);
        this._subViews = new Array();
    }
    LayoutBase.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof view.View) {
            this.addChild(value);
        }
    };
    LayoutBase.prototype.getChildrenCount = function () {
        return this._subViews.length;
    };
    Object.defineProperty(LayoutBase.prototype, "_childrenCount", {
        get: function () {
            return this._subViews.length;
        },
        enumerable: true,
        configurable: true
    });
    LayoutBase.prototype.getChildAt = function (index) {
        return this._subViews[index];
    };
    LayoutBase.prototype.getChildIndex = function (child) {
        return this._subViews.indexOf(child);
    };
    LayoutBase.prototype.getChildById = function (id) {
        return view.getViewById(this, id);
    };
    LayoutBase.prototype.addChild = function (child) {
        this._addView(child);
        this._subViews.push(child);
    };
    LayoutBase.prototype.insertChild = function (child, atIndex) {
        this._addView(child, atIndex);
        this._subViews.splice(atIndex, 0, child);
    };
    LayoutBase.prototype.removeChild = function (child) {
        this._removeView(child);
        var index = this._subViews.indexOf(child);
        this._subViews.splice(index, 1);
    };
    LayoutBase.prototype._eachChildView = function (callback) {
        var i;
        var length = this._subViews.length;
        var retVal;
        for (i = 0; i < length; i++) {
            retVal = callback(this._subViews[i]);
            if (retVal === false) {
                break;
            }
        }
    };
    Object.defineProperty(LayoutBase.prototype, "padding", {
        get: function () {
            return this.style.padding;
        },
        set: function (value) {
            this.style.padding = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, "paddingTop", {
        get: function () {
            return this.style.paddingTop;
        },
        set: function (value) {
            this.style.paddingTop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, "paddingRight", {
        get: function () {
            return this.style.paddingRight;
        },
        set: function (value) {
            this.style.paddingRight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, "paddingBottom", {
        get: function () {
            return this.style.paddingBottom;
        },
        set: function (value) {
            this.style.paddingBottom = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutBase.prototype, "paddingLeft", {
        get: function () {
            return this.style.paddingLeft;
        },
        set: function (value) {
            this.style.paddingLeft = value;
        },
        enumerable: true,
        configurable: true
    });
    LayoutBase.prototype.onClipToBoundsChanged = function (oldValue, newValue) {
        var nativeView = this._nativeView;
        if (!nativeView) {
            return;
        }
        if (nativeView instanceof UIView) {
            nativeView.clipsToBounds = newValue;
        }
        else if (nativeView instanceof android.view.ViewGroup) {
            nativeView.setClipChildren(newValue);
        }
    };
    LayoutBase.onClipToBoundsPropertyChanged = function (data) {
        var layout = data.object;
        layout.onClipToBoundsChanged(data.oldValue, data.newValue);
    };
    LayoutBase.clipToBoundsProperty = new dependencyObservable.Property("clipToBounds", "LayoutBase", new proxy.PropertyMetadata(true, dependencyObservable.PropertyMetadataSettings.None, LayoutBase.onClipToBoundsPropertyChanged));
    return LayoutBase;
})(view.CustomLayoutView);
exports.LayoutBase = LayoutBase;
