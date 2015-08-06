var common = require("ui/time-picker/time-picker-common");
function onHourPropertyChanged(data) {
    var picker = data.object;
    picker._setNativeHourSilently(data.newValue);
}
common.TimePicker.hourProperty.metadata.onSetNativeValue = onHourPropertyChanged;
function onMinutePropertyChanged(data) {
    var picker = data.object;
    picker._setNativeMinuteSilently(data.newValue);
}
common.TimePicker.minuteProperty.metadata.onSetNativeValue = onMinutePropertyChanged;
global.moduleMerge(common, exports);
var TimePicker = (function (_super) {
    __extends(TimePicker, _super);
    function TimePicker() {
        _super.apply(this, arguments);
        this._isSettingTime = false;
    }
    Object.defineProperty(TimePicker.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    TimePicker.prototype._createUI = function () {
        this._android = new android.widget.TimePicker(this._context);
        var that = new WeakRef(this);
        this._listener = new android.widget.TimePicker.OnTimeChangedListener({
            get owner() {
                return that.get();
            },
            onTimeChanged: function (picker, hour, minute) {
                if (this.owner && !this.owner._isSettingTime) {
                    if (hour !== this.owner.hour) {
                        this.owner._onPropertyChangedFromNative(common.TimePicker.hourProperty, hour);
                    }
                    if (minute !== this.owner.minute) {
                        this.owner._onPropertyChangedFromNative(common.TimePicker.minuteProperty, minute);
                    }
                }
            }
        });
        this._android.setOnTimeChangedListener(this._listener);
    };
    TimePicker.prototype._setNativeHourSilently = function (newValue) {
        if (!this.android) {
            return;
        }
        this._isSettingTime = true;
        try {
            this.android.setCurrentHour(new java.lang.Integer(newValue));
        }
        finally {
            this._isSettingTime = false;
        }
    };
    TimePicker.prototype._setNativeMinuteSilently = function (newValue) {
        if (!this.android) {
            return;
        }
        this._isSettingTime = true;
        try {
            this.android.setCurrentMinute(new java.lang.Integer(newValue));
        }
        finally {
            this._isSettingTime = false;
        }
    };
    return TimePicker;
})(common.TimePicker);
exports.TimePicker = TimePicker;
