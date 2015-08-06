var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var view = require("ui/core/view");
var TimePicker = (function (_super) {
    __extends(TimePicker, _super);
    function TimePicker() {
        _super.call(this);
    }
    Object.defineProperty(TimePicker.prototype, "hour", {
        get: function () {
            return this._getValue(TimePicker.hourProperty);
        },
        set: function (value) {
            this._setValue(TimePicker.hourProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimePicker.prototype, "minute", {
        get: function () {
            return this._getValue(TimePicker.minuteProperty);
        },
        set: function (value) {
            this._setValue(TimePicker.minuteProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    TimePicker.hourProperty = new dependencyObservable.Property("hour", "TimePicker", new proxy.PropertyMetadata(undefined));
    TimePicker.minuteProperty = new dependencyObservable.Property("minute", "TimePicker", new proxy.PropertyMetadata(undefined));
    return TimePicker;
})(view.View);
exports.TimePicker = TimePicker;
