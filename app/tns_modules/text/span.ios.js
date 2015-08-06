var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var spanCommon = require("text/span-common");
var enums = require("ui/enums");
require("utils/module-merge").merge(spanCommon, exports);
var Span = (function (_super) {
    __extends(Span, _super);
    function Span() {
        _super.apply(this, arguments);
    }
    Span.prototype.updateSpanModifiers = function (parent) {
        _super.prototype.updateSpanModifiers.call(this, parent);
        var realFontFamily = this.fontFamily || (parent ? parent.fontFamily : undefined);
        var realFontSize = this.fontSize ||
            (parent ? parent.fontSize : undefined) ||
            (parent && parent.parent ? parent.parent.style.fontSize : undefined);
        var realFontAttributes = this.fontAttributes || (parent ? parent.fontAttributes : undefined);
        if (realFontAttributes || realFontFamily || realFontSize) {
            var font;
            if (!realFontSize) {
                realFontSize = UIFont.systemFontSize();
            }
            if (realFontFamily) {
                font = UIFont.fontWithNameSize(realFontFamily, realFontSize);
            }
            if (!font) {
                var fontDescriptor = UIFontDescriptor.new();
                var symbolicTraits;
                if (realFontAttributes & enums.FontAttributes.Bold) {
                    symbolicTraits |= UIFontDescriptorSymbolicTraits.UIFontDescriptorTraitBold;
                }
                if (realFontAttributes & enums.FontAttributes.Italic) {
                    symbolicTraits |= UIFontDescriptorSymbolicTraits.UIFontDescriptorTraitItalic;
                }
                font = UIFont.fontWithDescriptorSize(fontDescriptor.fontDescriptorWithSymbolicTraits(symbolicTraits), realFontSize);
            }
            this.spanModifiers.push({
                key: NSFontAttributeName,
                value: font
            });
        }
        var realForegroundColor = this.foregroundColor ||
            (parent ? parent.foregroundColor : undefined) ||
            (parent && parent.parent ? parent.parent.style.color : undefined);
        if (realForegroundColor) {
            this.spanModifiers.push({
                key: NSForegroundColorAttributeName,
                value: realForegroundColor.ios
            });
        }
        var realBackgroundColor = this.backgroundColor ||
            (parent ? parent.backgroundColor : undefined) ||
            (parent && parent.parent ? parent.parent.style.backgroundColor : undefined);
        if (realBackgroundColor) {
            this.spanModifiers.push({
                key: NSBackgroundColorAttributeName,
                value: realBackgroundColor.ios
            });
        }
        var realUnderline = this.underline || (parent ? parent.underline : undefined);
        if (realUnderline) {
            this.spanModifiers.push({
                key: NSUnderlineStyleAttributeName,
                value: realUnderline
            });
        }
        var realStrikethrough = this.strikethrough || (parent ? parent.strikethrough : undefined);
        if (realStrikethrough) {
            this.spanModifiers.push({
                key: NSStrikethroughStyleAttributeName,
                value: realStrikethrough
            });
        }
    };
    return Span;
})(spanCommon.Span);
exports.Span = Span;
