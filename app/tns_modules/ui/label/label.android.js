var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/label/label-common");
function onTextWrapPropertyChanged(data) {
    var label = data.object;
    if (!label.android) {
        return;
    }
    if (data.newValue) {
        label.android.setSingleLine(false);
        label.android.setEllipsize(null);
    }
    else {
        label.android.setSingleLine(true);
        label.android.setEllipsize(android.text.TextUtils.TruncateAt.END);
    }
}
common.Label.textWrapProperty.metadata.onSetNativeValue = onTextWrapPropertyChanged;
require("utils/module-merge").merge(common, exports);
var Label = (function (_super) {
    __extends(Label, _super);
    function Label() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Label.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Label.prototype._createUI = function () {
        this._android = new android.widget.TextView(this._context);
        this._android.setSingleLine(true);
        this._android.setEllipsize(android.text.TextUtils.TruncateAt.END);
    };
    return Label;
})(common.Label);
exports.Label = Label;
