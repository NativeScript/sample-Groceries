var spanCommon = require("text/span-common");
var enums = require("ui/enums");
var utils = require("utils/utils");
global.moduleMerge(spanCommon, exports);
var Span = (function (_super) {
    __extends(Span, _super);
    function Span() {
        _super.apply(this, arguments);
    }
    Span.prototype.updateSpanModifiers = function (parent) {
        _super.prototype.updateSpanModifiers.call(this, parent);
        var realFontFamily = this.fontFamily || (parent ? parent.fontFamily : undefined);
        if (realFontFamily) {
            this.spanModifiers.push(new android.text.style.TypefaceSpan(realFontFamily));
        }
        var realFontSize = this.fontSize ||
            (parent ? parent.fontSize : undefined) ||
            (parent && parent.parent ? parent.parent.style.fontSize : undefined);
        if (realFontSize) {
            this.spanModifiers.push(new android.text.style.AbsoluteSizeSpan(realFontSize * utils.layout.getDisplayDensity()));
        }
        var realForegroundColor = this.foregroundColor ||
            (parent ? parent.foregroundColor : undefined) ||
            (parent && parent.parent ? parent.parent.style.color : undefined);
        if (realForegroundColor) {
            this.spanModifiers.push(new android.text.style.ForegroundColorSpan(realForegroundColor.android));
        }
        var realBackgroundColor = this.backgroundColor ||
            (parent ? parent.backgroundColor : undefined) ||
            (parent && parent.parent ? parent.parent.style.backgroundColor : undefined);
        if (realBackgroundColor) {
            this.spanModifiers.push(new android.text.style.BackgroundColorSpan(realBackgroundColor.android));
        }
        var realFontAttributes = this.fontAttributes || (parent ? parent.fontAttributes : undefined);
        if (realFontAttributes) {
            if ((realFontAttributes & enums.FontAttributes.Bold) && (realFontAttributes & enums.FontAttributes.Italic)) {
                this.spanModifiers.push(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD_ITALIC));
            }
            else if (realFontAttributes & enums.FontAttributes.Bold) {
                this.spanModifiers.push(new android.text.style.StyleSpan(android.graphics.Typeface.BOLD));
            }
            else if (realFontAttributes & enums.FontAttributes.Italic) {
                this.spanModifiers.push(new android.text.style.StyleSpan(android.graphics.Typeface.ITALIC));
            }
        }
        var realUnderline = this.underline || (parent ? parent.underline : undefined);
        if (realUnderline) {
            this.spanModifiers.push(new android.text.style.UnderlineSpan());
        }
        var realStrikethrough = this.strikethrough || (parent ? parent.strikethrough : undefined);
        if (realStrikethrough) {
            this.spanModifiers.push(new android.text.style.StrikethroughSpan());
        }
    };
    return Span;
})(spanCommon.Span);
exports.Span = Span;
