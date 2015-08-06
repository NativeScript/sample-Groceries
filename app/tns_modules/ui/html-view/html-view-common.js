var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var view = require("ui/core/view");
var HtmlView = (function (_super) {
    __extends(HtmlView, _super);
    function HtmlView(options) {
        _super.call(this, options);
    }
    Object.defineProperty(HtmlView.prototype, "html", {
        get: function () {
            return this._getValue(HtmlView.htmlProperty);
        },
        set: function (value) {
            this._setValue(HtmlView.htmlProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    HtmlView.htmlProperty = new dependencyObservable.Property("html", "HtmlView", new proxy.PropertyMetadata(false, dependencyObservable.PropertyMetadataSettings.AffectsLayout));
    return HtmlView;
})(view.View);
exports.HtmlView = HtmlView;
