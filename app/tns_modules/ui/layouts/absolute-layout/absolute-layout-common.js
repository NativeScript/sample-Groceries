var layouts = require("ui/layouts/layout-base");
var dependencyObservable = require("ui/core/dependency-observable");
var view = require("ui/core/view");
var proxy = require("ui/core/proxy");
function validateArgs(element) {
    if (!element) {
        throw new Error("element cannot be null or undefinied.");
    }
    return element;
}
var AbsoluteLayout = (function (_super) {
    __extends(AbsoluteLayout, _super);
    function AbsoluteLayout() {
        _super.apply(this, arguments);
    }
    AbsoluteLayout.isValid = function (value) {
        return isFinite(value);
    };
    AbsoluteLayout.onLeftPropertyChanged = function (data) {
        var uiView = data.object;
        if (uiView instanceof view.View) {
            var layout = uiView.parent;
            if (layout instanceof AbsoluteLayout) {
                layout.onLeftChanged(uiView, data.oldValue, data.newValue);
            }
        }
    };
    AbsoluteLayout.onTopPropertyChanged = function (data) {
        var uiView = data.object;
        if (uiView instanceof view.View) {
            var layout = uiView.parent;
            if (layout instanceof AbsoluteLayout) {
                layout.onTopChanged(uiView, data.oldValue, data.newValue);
            }
        }
    };
    AbsoluteLayout.getLeft = function (element) {
        return validateArgs(element)._getValue(AbsoluteLayout.leftProperty);
    };
    AbsoluteLayout.setLeft = function (element, value) {
        validateArgs(element)._setValue(AbsoluteLayout.leftProperty, value);
    };
    AbsoluteLayout.getTop = function (element) {
        return validateArgs(element)._getValue(AbsoluteLayout.topProperty);
    };
    AbsoluteLayout.setTop = function (element, value) {
        validateArgs(element)._setValue(AbsoluteLayout.topProperty, value);
    };
    AbsoluteLayout.prototype.onLeftChanged = function (view, oldValue, newValue) {
    };
    AbsoluteLayout.prototype.onTopChanged = function (view, oldValue, newValue) {
    };
    AbsoluteLayout.leftProperty = new dependencyObservable.Property("left", "AbsoluteLayout", new proxy.PropertyMetadata(0, undefined, AbsoluteLayout.onLeftPropertyChanged, AbsoluteLayout.isValid));
    AbsoluteLayout.topProperty = new dependencyObservable.Property("top", "AbsoluteLayout", new proxy.PropertyMetadata(0, undefined, AbsoluteLayout.onTopPropertyChanged, AbsoluteLayout.isValid));
    return AbsoluteLayout;
})(layouts.LayoutBase);
exports.AbsoluteLayout = AbsoluteLayout;
