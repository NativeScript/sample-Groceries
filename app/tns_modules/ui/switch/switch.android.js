var common = require("ui/switch/switch-common");
function onCheckedPropertyChanged(data) {
    var swtch = data.object;
    if (!swtch.android) {
        return;
    }
    swtch.android.setChecked(data.newValue);
}
common.Switch.checkedProperty.metadata.onSetNativeValue = onCheckedPropertyChanged;
global.moduleMerge(common, exports);
var Switch = (function (_super) {
    __extends(Switch, _super);
    function Switch() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Switch.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Switch.prototype._createUI = function () {
        this._android = new android.widget.Switch(this._context);
        var that = new WeakRef(this);
        this._android.setOnCheckedChangeListener(new android.widget.CompoundButton.OnCheckedChangeListener({
            get owner() {
                return that.get();
            },
            onCheckedChanged: function (sender, isChecked) {
                if (this.owner) {
                    this.owner._onPropertyChangedFromNative(common.Switch.checkedProperty, isChecked);
                }
            }
        }));
    };
    return Switch;
})(common.Switch);
exports.Switch = Switch;
