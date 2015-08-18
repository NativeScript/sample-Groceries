var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/slider/slider-common");
function onValuePropertyChanged(data) {
    var slider = data.object;
    if (!slider.android) {
        return;
    }
    slider._setNativeValuesSilently(data.newValue - slider.minValue, slider.maxValue - slider.minValue);
}
function onMinValuePropertyChanged(data) {
    var slider = data.object;
    if (!slider.android) {
        return;
    }
    slider._setNativeValuesSilently(slider.value - data.newValue, slider.maxValue - data.newValue);
}
function onMaxValuePropertyChanged(data) {
    var slider = data.object;
    if (!slider.android) {
        return;
    }
    slider.android.setMax(data.newValue - slider.minValue);
}
common.Slider.valueProperty.metadata.onSetNativeValue = onValuePropertyChanged;
common.Slider.minValueProperty.metadata.onSetNativeValue = onMinValuePropertyChanged;
common.Slider.maxValueProperty.metadata.onSetNativeValue = onMaxValuePropertyChanged;
require("utils/module-merge").merge(common, exports);
var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        _super.apply(this, arguments);
    }
    Slider.prototype._createUI = function () {
        this._android = new android.widget.SeekBar(this._context);
        var that = new WeakRef(this);
        this._changeListener = new android.widget.SeekBar.OnSeekBarChangeListener({
            onProgressChanged: function (seekBar, progress, fromUser) {
                var owner = that.get();
                if (owner) {
                    if (!owner._supressNativeValue) {
                        var newValue = seekBar.getProgress() + owner.minValue;
                        owner._onPropertyChangedFromNative(common.Slider.valueProperty, newValue);
                    }
                }
            },
            onStartTrackingTouch: function (seekBar) {
            },
            onStopTrackingTouch: function (seekBar) {
            }
        });
        this._android.setOnSeekBarChangeListener(this._changeListener);
    };
    Object.defineProperty(Slider.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Slider.prototype._setNativeValuesSilently = function (newValue, newMaxValue) {
        if (!this.android) {
            return;
        }
        this._supressNativeValue = true;
        try {
            this.android.setMax(newMaxValue);
            this.android.setProgress(newValue);
        }
        finally {
            this._supressNativeValue = false;
        }
    };
    return Slider;
})(common.Slider);
exports.Slider = Slider;
