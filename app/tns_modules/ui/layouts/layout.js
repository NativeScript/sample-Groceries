var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require("ui/core/view");
var dependencyObservable = require("ui/core/dependency-observable");
var Layout = (function (_super) {
    __extends(Layout, _super);
    function Layout() {
        _super.apply(this, arguments);
        this._subViews = new Array();
    }
    Layout.prototype._addChildFromBuilder = function (name, value) {
        if (value instanceof view.View) {
            this.addChild(value);
        }
    };
    Layout.prototype.getChildrenCount = function () {
        return this._subViews.length;
    };
    Object.defineProperty(Layout.prototype, "_childrenCount", {
        get: function () {
            return this._subViews.length;
        },
        enumerable: true,
        configurable: true
    });
    Layout.prototype.getChildAt = function (index) {
        return this._subViews[index];
    };
    Layout.prototype.getChildById = function (id) {
        return view.getViewById(this, id);
    };
    Layout.prototype.addChild = function (child) {
        this._addView(child);
        this._subViews.push(child);
    };
    Layout.prototype.removeChild = function (child) {
        this._removeView(child);
        var index = this._subViews.indexOf(child);
        this._subViews.splice(index, 1);
    };
    Layout.prototype._eachChildView = function (callback) {
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
    Object.defineProperty(Layout.prototype, "paddingTop", {
        get: function () {
            return this.style.paddingTop;
        },
        set: function (value) {
            this.style.paddingTop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "paddingRight", {
        get: function () {
            return this.style.paddingRight;
        },
        set: function (value) {
            this.style.paddingRight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "paddingBottom", {
        get: function () {
            return this.style.paddingBottom;
        },
        set: function (value) {
            this.style.paddingBottom = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "paddingLeft", {
        get: function () {
            return this.style.paddingLeft;
        },
        set: function (value) {
            this.style.paddingLeft = value;
        },
        enumerable: true,
        configurable: true
    });
    Layout.onClipToBoundsPropertyChanged = function (data) {
        var layout = data.object;
        var nativeView = layout._nativeView;
        var value = data.newValue;
        if (nativeView instanceof android.view.ViewGroup) {
            nativeView.setClipChildren(value);
        }
        else if (nativeView instanceof UIView) {
            nativeView.clipsToBounds = value;
        }
    };
    Layout.clipToBoundsProperty = new dependencyObservable.Property("clipToBounds", "Layout", new dependencyObservable.PropertyMetadata(true, dependencyObservable.PropertyMetadataSettings.None, Layout.onClipToBoundsPropertyChanged));
    return Layout;
})(view.CustomLayoutView);
exports.Layout = Layout;
