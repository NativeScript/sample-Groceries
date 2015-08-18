var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/html-view/html-view-common");
var utils = require("utils/utils");
var types = require("utils/types");
var viewModule = require("ui/core/view");
function onHtmlPropertyChanged(data) {
    var view = data.object;
    if (!view.ios) {
        return;
    }
    if (types.isString(data.newValue)) {
        var htmlString = NSString.stringWithString(data.newValue);
        var nsData = htmlString.dataUsingEncoding(NSUnicodeStringEncoding);
        view.ios.attributedText = NSAttributedString.alloc().initWithDataOptionsDocumentAttributesError(nsData, (_a = {}, _a[NSDocumentTypeDocumentAttribute] = NSHTMLTextDocumentType, _a), null);
    }
    else {
        view.ios.attributedText = NSAttributedString.new();
    }
    var _a;
}
common.HtmlView.htmlProperty.metadata.onSetNativeValue = onHtmlPropertyChanged;
require("utils/module-merge").merge(common, exports);
var HtmlView = (function (_super) {
    __extends(HtmlView, _super);
    function HtmlView(options) {
        _super.call(this, options);
        this._ios = new UILabel();
        _super.prototype._prepareNativeView.call(this, this._ios);
    }
    Object.defineProperty(HtmlView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlView.prototype, "_nativeView", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    HtmlView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var nativeView = this._nativeView;
        if (nativeView) {
            var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
            var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
            var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
            var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
            if (widthMode === utils.layout.UNSPECIFIED) {
                width = Number.POSITIVE_INFINITY;
            }
            if (heightMode === utils.layout.UNSPECIFIED) {
                height = Number.POSITIVE_INFINITY;
            }
            var nativeSize = nativeView.sizeThatFits(CGSizeMake(width, height));
            var labelWidth = nativeSize.width;
            labelWidth = Math.min(labelWidth, width);
            var measureWidth = Math.max(labelWidth, this.minWidth);
            var measureHeight = Math.max(nativeSize.height, this.minHeight);
            var widthAndState = viewModule.View.resolveSizeAndState(measureWidth, width, widthMode, 0);
            var heightAndState = viewModule.View.resolveSizeAndState(measureHeight, height, heightMode, 0);
            this.setMeasuredDimension(widthAndState, heightAndState);
        }
    };
    return HtmlView;
})(common.HtmlView);
exports.HtmlView = HtmlView;
