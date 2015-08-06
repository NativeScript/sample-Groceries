var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var textBase = require("ui/text-base");
var editableTextBase = require("ui/editable-text-base");
exports.secureProperty = new dependencyObservable.Property("secure", "TextField", new proxy.PropertyMetadata(false));
global.moduleMerge(textBase, exports);
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(options) {
        _super.call(this, options);
    }
    Object.defineProperty(TextField.prototype, "secure", {
        get: function () {
            return this._getValue(exports.secureProperty);
        },
        set: function (value) {
            this._setValue(exports.secureProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    return TextField;
})(editableTextBase.EditableTextBase);
exports.TextField = TextField;
