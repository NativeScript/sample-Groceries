var view = require("ui/core/view");
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var busyProperty = new dependencyObservable.Property("busy", "ActivityIndicator", new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.AffectsLayout));
var ActivityIndicator = (function (_super) {
    __extends(ActivityIndicator, _super);
    function ActivityIndicator() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ActivityIndicator.prototype, "busy", {
        get: function () {
            return this._getValue(ActivityIndicator.busyProperty);
        },
        set: function (value) {
            this._setValue(ActivityIndicator.busyProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ActivityIndicator.busyProperty = busyProperty;
    return ActivityIndicator;
})(view.View);
exports.ActivityIndicator = ActivityIndicator;
