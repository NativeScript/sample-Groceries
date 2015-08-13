var common = require("ui/html-view/html-view-common");
var types = require("utils/types");
function onHtmlPropertyChanged(data) {
    var view = data.object;
    if (!view.android) {
        return;
    }
    if (types.isString(data.newValue)) {
        view.android.setText(android.text.Html.fromHtml(data.newValue));
    }
    else {
        view.android.setText("");
    }
}
common.HtmlView.htmlProperty.metadata.onSetNativeValue = onHtmlPropertyChanged;
global.moduleMerge(common, exports);
var HtmlView = (function (_super) {
    __extends(HtmlView, _super);
    function HtmlView() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(HtmlView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    HtmlView.prototype._createUI = function () {
        this._android = new android.widget.TextView(this._context);
    };
    return HtmlView;
})(common.HtmlView);
exports.HtmlView = HtmlView;
