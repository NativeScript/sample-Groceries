var style = require("ui/styling/style");
var stylersCommon = require("ui/styling/stylers-common");
var enums = require("ui/enums");
var background = require("ui/styling/background");
require("utils/module-merge").merge(stylersCommon, exports);
var DefaultStyler = (function () {
    function DefaultStyler() {
    }
    DefaultStyler.setBackgroundInternalProperty = function (view, newValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            nativeView.backgroundColor = background.ios.createBackgroundUIColor(view);
        }
    };
    DefaultStyler.resetBackgroundInternalProperty = function (view, nativeValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            nativeView.backgroundColor = nativeValue;
        }
    };
    DefaultStyler.getNativeBackgroundInternalValue = function (view) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.backgroundColor;
        }
        return undefined;
    };
    DefaultStyler.setVisibilityProperty = function (view, newValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.hidden = (newValue !== enums.Visibility.visible);
        }
    };
    DefaultStyler.resetVisibilityProperty = function (view, nativeValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.hidden = false;
        }
    };
    DefaultStyler.setOpacityProperty = function (view, newValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.alpha = newValue;
        }
    };
    DefaultStyler.resetOpacityProperty = function (view, nativeValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.alpha = 1.0;
        }
    };
    DefaultStyler.setBorderWidthProperty = function (view, newValue) {
        if (view._nativeView instanceof UIView) {
            view._nativeView.layer.borderWidth = newValue;
        }
    };
    DefaultStyler.resetBorderWidthProperty = function (view, nativeValue) {
        if (view._nativeView instanceof UIView) {
            view._nativeView.layer.borderWidth = nativeValue;
        }
    };
    DefaultStyler.getBorderWidthProperty = function (view) {
        if (view._nativeView instanceof UIView) {
            return view._nativeView.layer.borderWidth;
        }
        return 0;
    };
    DefaultStyler.setBorderColorProperty = function (view, newValue) {
        if (view._nativeView instanceof UIView && newValue instanceof UIColor) {
            view._nativeView.layer.borderColor = newValue.CGColor;
        }
    };
    DefaultStyler.resetBorderColorProperty = function (view, nativeValue) {
        if (view._nativeView instanceof UIView && nativeValue instanceof UIColor) {
            view._nativeView.layer.borderColor = nativeValue;
        }
    };
    DefaultStyler.getBorderColorProperty = function (view) {
        if (view._nativeView instanceof UIView) {
            return view._nativeView.layer.borderColor;
        }
        return undefined;
    };
    DefaultStyler.setBorderRadiusProperty = function (view, newValue) {
        if (view._nativeView instanceof UIView) {
            view._nativeView.layer.cornerRadius = newValue;
        }
    };
    DefaultStyler.resetBorderRadiusProperty = function (view, nativeValue) {
        if (view._nativeView instanceof UIView) {
            view._nativeView.layer.cornerRadius = nativeValue;
        }
    };
    DefaultStyler.getBorderRadiusProperty = function (view) {
        if (view._nativeView instanceof UIView) {
            return view._nativeView.layer.cornerRadius;
        }
        return 0;
    };
    DefaultStyler.registerHandlers = function () {
        style.registerHandler(style.backgroundInternalProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBackgroundInternalProperty, DefaultStyler.resetBackgroundInternalProperty, DefaultStyler.getNativeBackgroundInternalValue));
        style.registerHandler(style.visibilityProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setVisibilityProperty, DefaultStyler.resetVisibilityProperty));
        style.registerHandler(style.opacityProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setOpacityProperty, DefaultStyler.resetOpacityProperty));
        style.registerHandler(style.borderWidthProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBorderWidthProperty, DefaultStyler.resetBorderWidthProperty, DefaultStyler.getBorderWidthProperty));
        style.registerHandler(style.borderColorProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBorderColorProperty, DefaultStyler.resetBorderColorProperty, DefaultStyler.getBorderColorProperty));
        style.registerHandler(style.borderRadiusProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBorderRadiusProperty, DefaultStyler.resetBorderRadiusProperty, DefaultStyler.getBorderRadiusProperty));
    };
    return DefaultStyler;
})();
exports.DefaultStyler = DefaultStyler;
var ButtonStyler = (function () {
    function ButtonStyler() {
    }
    ButtonStyler.setColorProperty = function (view, newValue) {
        var btn = view._nativeView;
        btn.setTitleColorForState(newValue, UIControlState.UIControlStateNormal);
    };
    ButtonStyler.resetColorProperty = function (view, nativeValue) {
        var btn = view._nativeView;
        btn.setTitleColorForState(nativeValue, UIControlState.UIControlStateNormal);
    };
    ButtonStyler.getNativeColorValue = function (view) {
        var btn = view._nativeView;
        return btn.titleColorForState(UIControlState.UIControlStateNormal);
    };
    ButtonStyler.setFontInternalProperty = function (view, newValue, nativeValue) {
        var btn = view._nativeView;
        btn.titleLabel.font = newValue.getUIFont(nativeValue);
    };
    ButtonStyler.resetFontInternalProperty = function (view, nativeValue) {
        var btn = view._nativeView;
        btn.titleLabel.font = nativeValue;
    };
    ButtonStyler.getNativeFontInternalValue = function (view) {
        var btn = view._nativeView;
        return btn.titleLabel.font;
    };
    ButtonStyler.setTextAlignmentProperty = function (view, newValue) {
        var btn = view._nativeView;
        setTextAlignment(btn.titleLabel, newValue);
        switch (newValue) {
            case enums.TextAlignment.left:
                btn.contentHorizontalAlignment = UIControlContentHorizontalAlignment.UIControlContentHorizontalAlignmentLeft;
                break;
            case enums.TextAlignment.center:
                btn.contentHorizontalAlignment = UIControlContentHorizontalAlignment.UIControlContentHorizontalAlignmentCenter;
                break;
            case enums.TextAlignment.right:
                btn.contentHorizontalAlignment = UIControlContentHorizontalAlignment.UIControlContentHorizontalAlignmentRight;
                break;
            default:
                break;
        }
    };
    ButtonStyler.resetTextAlignmentProperty = function (view, nativeValue) {
        var btn = view._nativeView;
        btn.titleLabel.textAlignment = nativeValue.textAlign;
        btn.contentHorizontalAlignment = nativeValue.contentAlign;
    };
    ButtonStyler.getNativeTextAlignmentValue = function (view) {
        var btn = view._nativeView;
        return {
            textAlign: btn.titleLabel.textAlignment,
            contentAlign: btn.contentHorizontalAlignment
        };
    };
    ButtonStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setColorProperty, ButtonStyler.resetColorProperty, ButtonStyler.getNativeColorValue), "Button");
        style.registerHandler(style.fontInternalProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setFontInternalProperty, ButtonStyler.resetFontInternalProperty, ButtonStyler.getNativeFontInternalValue), "Button");
        style.registerHandler(style.textAlignmentProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setTextAlignmentProperty, ButtonStyler.resetTextAlignmentProperty, ButtonStyler.getNativeTextAlignmentValue), "Button");
    };
    return ButtonStyler;
})();
exports.ButtonStyler = ButtonStyler;
var TextBaseStyler = (function () {
    function TextBaseStyler() {
    }
    TextBaseStyler.setFontInternalProperty = function (view, newValue, nativeValue) {
        var ios = view._nativeView;
        ios.font = newValue.getUIFont(nativeValue);
    };
    TextBaseStyler.resetFontInternalProperty = function (view, nativeValue) {
        var ios = view._nativeView;
        ios.font = nativeValue;
    };
    TextBaseStyler.getNativeFontInternalValue = function (view) {
        var ios = view._nativeView;
        return ios.font;
    };
    TextBaseStyler.setTextAlignmentProperty = function (view, newValue) {
        setTextAlignment(view._nativeView, newValue);
    };
    TextBaseStyler.resetTextAlignmentProperty = function (view, nativeValue) {
        var ios = view._nativeView;
        ios.textAlignment = nativeValue;
    };
    TextBaseStyler.getNativeTextAlignmentValue = function (view) {
        var ios = view._nativeView;
        return ios.textAlignment;
    };
    TextBaseStyler.setColorProperty = function (view, newValue) {
        var ios = view._nativeView;
        ios.textColor = newValue;
    };
    TextBaseStyler.resetColorProperty = function (view, nativeValue) {
        var ios = view._nativeView;
        ios.textColor = nativeValue;
    };
    TextBaseStyler.getNativeColorValue = function (view) {
        var ios = view._nativeView;
        return ios.textColor;
    };
    TextBaseStyler.registerHandlers = function () {
        style.registerHandler(style.fontInternalProperty, new stylersCommon.StylePropertyChangedHandler(TextBaseStyler.setFontInternalProperty, TextBaseStyler.resetFontInternalProperty, TextBaseStyler.getNativeFontInternalValue), "TextBase");
        style.registerHandler(style.textAlignmentProperty, new stylersCommon.StylePropertyChangedHandler(TextBaseStyler.setTextAlignmentProperty, TextBaseStyler.resetTextAlignmentProperty, TextBaseStyler.getNativeTextAlignmentValue), "TextBase");
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TextBaseStyler.setColorProperty, TextBaseStyler.resetColorProperty, TextBaseStyler.getNativeColorValue), "TextBase");
    };
    return TextBaseStyler;
})();
exports.TextBaseStyler = TextBaseStyler;
var TextViewStyler = (function () {
    function TextViewStyler() {
    }
    TextViewStyler.setColorProperty = function (view, newValue) {
        var textView = view._nativeView;
        TextViewStyler._setTextViewColor(textView, newValue);
    };
    TextViewStyler.resetColorProperty = function (view, nativeValue) {
        var textView = view._nativeView;
        TextViewStyler._setTextViewColor(textView, nativeValue);
    };
    TextViewStyler._setTextViewColor = function (textView, newValue) {
        var color = newValue;
        if (textView.isShowingHint && color) {
            textView.textColor = color.colorWithAlphaComponent(0.22);
        }
        else {
            textView.textColor = color;
        }
    };
    TextViewStyler.getNativeColorValue = function (view) {
        var textView = view._nativeView;
        if (textView.isShowingHint && textView.textColor) {
            return textView.textColor.colorWithAlphaComponent(1);
        }
        else {
            return textView.textColor;
        }
    };
    TextViewStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setColorProperty, TextViewStyler.resetColorProperty, TextViewStyler.getNativeColorValue), "TextView");
    };
    return TextViewStyler;
})();
exports.TextViewStyler = TextViewStyler;
var SegmentedBarStyler = (function () {
    function SegmentedBarStyler() {
    }
    SegmentedBarStyler.setColorProperty = function (view, newValue) {
        var bar = view.ios;
        var attrs = NSMutableDictionary.new();
        attrs.setValueForKey(newValue, NSForegroundColorAttributeName);
        bar.setTitleTextAttributesForState(attrs, UIControlState.UIControlStateNormal);
    };
    SegmentedBarStyler.resetColorProperty = function (view, nativeValue) {
        var bar = view.ios;
        var attrs = NSMutableDictionary.new();
        attrs.setValueForKey(nativeValue, NSForegroundColorAttributeName);
        bar.setTitleTextAttributesForState(attrs, UIControlState.UIControlStateNormal);
    };
    SegmentedBarStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(SegmentedBarStyler.setColorProperty, SegmentedBarStyler.resetColorProperty), "SegmentedBar");
    };
    return SegmentedBarStyler;
})();
exports.SegmentedBarStyler = SegmentedBarStyler;
var SearchBarStyler = (function () {
    function SearchBarStyler() {
    }
    SearchBarStyler.setBackgroundColorProperty = function (view, newValue) {
        var bar = view.ios;
        bar.barTintColor = newValue;
    };
    SearchBarStyler.getBackgroundColorProperty = function (view) {
        var bar = view.ios;
        return bar.barTintColor;
    };
    SearchBarStyler.resetBackgroundColorProperty = function (view, nativeValue) {
        var bar = view.ios;
        bar.barTintColor = nativeValue;
    };
    SearchBarStyler.getColorProperty = function (view) {
        var bar = view.ios;
        var sf = bar.valueForKey("_searchField");
        if (sf) {
            return sf.textColor;
        }
        return undefined;
    };
    SearchBarStyler.setColorProperty = function (view, newValue) {
        var bar = view.ios;
        var sf = bar.valueForKey("_searchField");
        if (sf) {
            sf.textColor = newValue;
        }
    };
    SearchBarStyler.resetColorProperty = function (view, nativeValue) {
        var bar = view.ios;
        var sf = bar.valueForKey("_searchField");
        if (sf) {
            sf.textColor = nativeValue;
        }
    };
    SearchBarStyler.registerHandlers = function () {
        style.registerHandler(style.backgroundColorProperty, new stylersCommon.StylePropertyChangedHandler(SearchBarStyler.setBackgroundColorProperty, SearchBarStyler.resetBackgroundColorProperty, SearchBarStyler.getBackgroundColorProperty), "SearchBar");
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(SearchBarStyler.setColorProperty, SearchBarStyler.resetColorProperty, SearchBarStyler.getColorProperty), "SearchBar");
    };
    return SearchBarStyler;
})();
exports.SearchBarStyler = SearchBarStyler;
function setTextAlignment(view, value) {
    switch (value) {
        case enums.TextAlignment.left:
            view.textAlignment = NSTextAlignment.NSTextAlignmentLeft;
            break;
        case enums.TextAlignment.center:
            view.textAlignment = NSTextAlignment.NSTextAlignmentCenter;
            break;
        case enums.TextAlignment.right:
            view.textAlignment = NSTextAlignment.NSTextAlignmentRight;
            break;
        default:
            break;
    }
}
function _registerDefaultStylers() {
    style.registerNoStylingClass("Frame");
    DefaultStyler.registerHandlers();
    TextBaseStyler.registerHandlers();
    ButtonStyler.registerHandlers();
    TextViewStyler.registerHandlers();
    SegmentedBarStyler.registerHandlers();
    SearchBarStyler.registerHandlers();
}
exports._registerDefaultStylers = _registerDefaultStylers;
