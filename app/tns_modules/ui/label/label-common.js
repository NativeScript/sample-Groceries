var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var textBase = require("ui/text-base");
var Label = (function (_super) {
    __extends(Label, _super);
    function Label(options) {
        _super.call(this, options);
    }
    Object.defineProperty(Label.prototype, "textWrap", {
        get: function () {
            return this._getValue(Label.textWrapProperty);
        },
        set: function (value) {
            this._setValue(Label.textWrapProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Label.textWrapProperty = new dependencyObservable.Property("textWrap", "Label", new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.AffectsLayout));
    return Label;
})(textBase.TextBase);
exports.Label = Label;
