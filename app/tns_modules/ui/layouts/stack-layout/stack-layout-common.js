var layouts = require("ui/layouts/layout-base");
var dependencyObservable = require("ui/core/dependency-observable");
var enums = require("ui/enums");
var proxy = require("ui/core/proxy");
var AffectsLayout = global.android ? dependencyObservable.PropertyMetadataSettings.None : dependencyObservable.PropertyMetadataSettings.AffectsLayout;
function validateOrientation(value) {
    return value === enums.Orientation.vertical || value === enums.Orientation.horizontal;
}
var StackLayout = (function (_super) {
    __extends(StackLayout, _super);
    function StackLayout() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(StackLayout.prototype, "orientation", {
        get: function () {
            return this._getValue(StackLayout.orientationProperty);
        },
        set: function (value) {
            this._setValue(StackLayout.orientationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    StackLayout.orientationProperty = new dependencyObservable.Property("orientation", "StackLayout", new proxy.PropertyMetadata(enums.Orientation.vertical, AffectsLayout, undefined, validateOrientation));
    return StackLayout;
})(layouts.LayoutBase);
exports.StackLayout = StackLayout;
