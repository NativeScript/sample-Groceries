var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/switch/switch-common");
function onCheckedPropertyChanged(data) {
    var swtch = data.object;
    swtch.ios.on = data.newValue;
}
common.Switch.checkedProperty.metadata.onSetNativeValue = onCheckedPropertyChanged;
require("utils/module-merge").merge(common, exports);
var SwitchChangeHandlerImpl = (function (_super) {
    __extends(SwitchChangeHandlerImpl, _super);
    function SwitchChangeHandlerImpl() {
        _super.apply(this, arguments);
    }
    SwitchChangeHandlerImpl.new = function () {
        return _super.new.call(this);
    };
    SwitchChangeHandlerImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    SwitchChangeHandlerImpl.prototype.valueChanged = function (sender) {
        this._owner._onPropertyChangedFromNative(common.Switch.checkedProperty, sender.on);
    };
    SwitchChangeHandlerImpl.ObjCExposedMethods = {
        'valueChanged': { returns: interop.types.void, params: [UISwitch] }
    };
    return SwitchChangeHandlerImpl;
})(NSObject);
var Switch = (function (_super) {
    __extends(Switch, _super);
    function Switch() {
        _super.call(this);
        this._ios = new UISwitch();
        this._handler = SwitchChangeHandlerImpl.new().initWithOwner(this);
        this._ios.addTargetActionForControlEvents(this._handler, "valueChanged", UIControlEvents.UIControlEventValueChanged);
    }
    Object.defineProperty(Switch.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return Switch;
})(common.Switch);
exports.Switch = Switch;
