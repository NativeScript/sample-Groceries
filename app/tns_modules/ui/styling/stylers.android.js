var types = require("utils/types");
var constants = require("utils/android_constants");
var style = require("ui/styling/style");
var stylersCommon = require("ui/styling/stylers-common");
var enums = require("ui/enums");
var utils = require("utils/utils");
var styleModule = require("ui/styling/style");
var background = require("ui/styling/background");
require("utils/module-merge").merge(stylersCommon, exports);
var _defaultBackgrounds = new Map();
function onBackgroundOrBorderPropertyChanged(v) {
    if (!v._nativeView) {
        return;
    }
    var backgroundValue = v.style._getValue(styleModule.backgroundInternalProperty);
    if (v.borderWidth !== 0 || v.borderRadius !== 0 || !backgroundValue.isEmpty()) {
        var nativeView = v._nativeView;
        var bkg = nativeView.getBackground();
        if (!(bkg instanceof background.ad.BorderDrawable)) {
            bkg = new background.ad.BorderDrawable();
            var viewClass = types.getClass(v);
            if (!_defaultBackgrounds.has(viewClass)) {
                _defaultBackgrounds.set(viewClass, nativeView.getBackground());
            }
            nativeView.setBackground(bkg);
        }
        var padding = v.borderWidth * utils.layout.getDisplayDensity();
        nativeView.setPadding(padding, padding, padding, padding);
        bkg.borderWidth = v.borderWidth;
        bkg.cornerRadius = v.borderRadius;
        bkg.borderColor = v.borderColor ? v.borderColor.android : android.graphics.Color.TRANSPARENT;
        bkg.background = backgroundValue;
    }
    else {
        var viewClass = types.getClass(v);
        if (_defaultBackgrounds.has(viewClass)) {
            v.android.setBackgroundDrawable(_defaultBackgrounds.get(viewClass));
        }
    }
}
var DefaultStyler = (function () {
    function DefaultStyler() {
    }
    DefaultStyler.setBackgroundBorderProperty = function (view, newValue, defaultValue) {
        onBackgroundOrBorderPropertyChanged(view);
    };
    DefaultStyler.resetBackgroundBorderProperty = function (view, nativeValue) {
        onBackgroundOrBorderPropertyChanged(view);
    };
    DefaultStyler.setVisibilityProperty = function (view, newValue) {
        var androidValue = (newValue === enums.Visibility.visible) ? android.view.View.VISIBLE : android.view.View.GONE;
        view.android.setVisibility(androidValue);
    };
    DefaultStyler.resetVisibilityProperty = function (view, nativeValue) {
        view.android.setVisibility(android.view.View.VISIBLE);
    };
    DefaultStyler.setOpacityProperty = function (view, newValue) {
        view.android.setAlpha(float(newValue));
    };
    DefaultStyler.resetOpacityProperty = function (view, nativeValue) {
        view.android.setAlpha(float(1.0));
    };
    DefaultStyler.setMinWidthProperty = function (view, newValue) {
        view._nativeView.setMinimumWidth(newValue * utils.layout.getDisplayDensity());
    };
    DefaultStyler.resetMinWidthProperty = function (view, nativeValue) {
        view._nativeView.setMinimumWidth(0);
    };
    DefaultStyler.setMinHeightProperty = function (view, newValue) {
        view._nativeView.setMinimumHeight(newValue * utils.layout.getDisplayDensity());
    };
    DefaultStyler.resetMinHeightProperty = function (view, nativeValue) {
        view._nativeView.setMinimumHeight(0);
    };
    DefaultStyler.registerHandlers = function () {
        style.registerHandler(style.visibilityProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setVisibilityProperty, DefaultStyler.resetVisibilityProperty));
        style.registerHandler(style.opacityProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setOpacityProperty, DefaultStyler.resetOpacityProperty));
        style.registerHandler(style.minWidthProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setMinWidthProperty, DefaultStyler.resetMinWidthProperty));
        style.registerHandler(style.minHeightProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setMinHeightProperty, DefaultStyler.resetMinHeightProperty));
        var borderHandler = new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBackgroundBorderProperty, DefaultStyler.resetBackgroundBorderProperty);
        style.registerHandler(style.backgroundInternalProperty, borderHandler);
        style.registerHandler(style.borderWidthProperty, borderHandler);
        style.registerHandler(style.borderColorProperty, borderHandler);
        style.registerHandler(style.borderRadiusProperty, borderHandler);
    };
    return DefaultStyler;
})();
exports.DefaultStyler = DefaultStyler;
var TextViewStyler = (function () {
    function TextViewStyler() {
    }
    TextViewStyler.setColorProperty = function (view, newValue) {
        view.android.setTextColor(newValue);
    };
    TextViewStyler.resetColorProperty = function (view, nativeValue) {
        view.android.setTextColor(nativeValue);
    };
    TextViewStyler.getNativeColorValue = function (view) {
        return view.android.getTextColors().getDefaultColor();
    };
    TextViewStyler.setFontInternalProperty = function (view, newValue, nativeValue) {
        var tv = view.android;
        var fontValue = newValue;
        var typeface = fontValue.getAndroidTypeface();
        if (typeface) {
            tv.setTypeface(typeface);
        }
        else {
            tv.setTypeface(nativeValue.typeface);
        }
        if (fontValue.fontSize) {
            tv.setTextSize(fontValue.fontSize);
        }
        else {
            tv.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, nativeValue.size);
        }
    };
    TextViewStyler.resetFontInternalProperty = function (view, nativeValue) {
        var tv = view.android;
        tv.setTypeface(nativeValue.typeface);
        tv.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, nativeValue.size);
    };
    TextViewStyler.getNativeFontInternalValue = function (view) {
        var tv = view.android;
        return {
            typeface: tv.getTypeface(),
            size: tv.getTextSize()
        };
    };
    TextViewStyler.setTextAlignmentProperty = function (view, newValue) {
        var verticalGravity = view.android.getGravity() & android.view.Gravity.VERTICAL_GRAVITY_MASK;
        switch (newValue) {
            case enums.TextAlignment.left:
                view.android.setGravity(android.view.Gravity.LEFT | verticalGravity);
                break;
            case enums.TextAlignment.center:
                view.android.setGravity(android.view.Gravity.CENTER_HORIZONTAL | verticalGravity);
                break;
            case enums.TextAlignment.right:
                view.android.setGravity(android.view.Gravity.RIGHT | verticalGravity);
                break;
            default:
                break;
        }
    };
    TextViewStyler.resetTextAlignmentProperty = function (view, nativeValue) {
        view.android.setGravity(nativeValue);
    };
    TextViewStyler.getNativeTextAlignmentValue = function (view) {
        return view.android.getGravity();
    };
    TextViewStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setColorProperty, TextViewStyler.resetColorProperty, TextViewStyler.getNativeColorValue), "TextBase");
        style.registerHandler(style.fontInternalProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setFontInternalProperty, TextViewStyler.resetFontInternalProperty, TextViewStyler.getNativeFontInternalValue), "TextBase");
        style.registerHandler(style.textAlignmentProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setTextAlignmentProperty, TextViewStyler.resetTextAlignmentProperty, TextViewStyler.getNativeTextAlignmentValue), "TextBase");
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setColorProperty, TextViewStyler.resetColorProperty, TextViewStyler.getNativeColorValue), "Button");
        style.registerHandler(style.fontInternalProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setFontInternalProperty, TextViewStyler.resetFontInternalProperty, TextViewStyler.getNativeFontInternalValue), "Button");
        style.registerHandler(style.textAlignmentProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setTextAlignmentProperty, TextViewStyler.resetTextAlignmentProperty, TextViewStyler.getNativeTextAlignmentValue), "Button");
    };
    return TextViewStyler;
})();
exports.TextViewStyler = TextViewStyler;
var ActivityIndicatorStyler = (function () {
    function ActivityIndicatorStyler() {
    }
    ActivityIndicatorStyler.setActivityIndicatorVisibilityProperty = function (view, newValue) {
        ActivityIndicatorStyler.setIndicatorVisibility(view.busy, newValue, view.android);
    };
    ActivityIndicatorStyler.resetActivityIndicatorVisibilityProperty = function (view, nativeValue) {
        ActivityIndicatorStyler.setIndicatorVisibility(view.busy, enums.Visibility.visible, view.android);
    };
    ActivityIndicatorStyler.setIndicatorVisibility = function (isBusy, visibility, nativeView) {
        if (visibility === enums.Visibility.collapsed || visibility === enums.Visibility.collapse) {
            nativeView.setVisibility(android.view.View.GONE);
        }
        else {
            nativeView.setVisibility(isBusy ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
        }
    };
    ActivityIndicatorStyler.registerHandlers = function () {
        style.registerHandler(style.visibilityProperty, new stylersCommon.StylePropertyChangedHandler(ActivityIndicatorStyler.setActivityIndicatorVisibilityProperty, ActivityIndicatorStyler.resetActivityIndicatorVisibilityProperty), "ActivityIndicator");
    };
    return ActivityIndicatorStyler;
})();
exports.ActivityIndicatorStyler = ActivityIndicatorStyler;
var SegmentedBarStyler = (function () {
    function SegmentedBarStyler() {
    }
    SegmentedBarStyler.setColorProperty = function (view, newValue) {
        var tabHost = view.android;
        for (var tabIndex = 0; tabIndex < tabHost.getTabWidget().getTabCount(); tabIndex++) {
            var tab = tabHost.getTabWidget().getChildTabViewAt(tabIndex);
            var t = tab.getChildAt(1);
            t.setTextColor(newValue);
        }
    };
    SegmentedBarStyler.resetColorProperty = function (view, nativeValue) {
        var tabHost = view.android;
        for (var tabIndex = 0; tabIndex < tabHost.getTabWidget().getTabCount(); tabIndex++) {
            var tab = tabHost.getTabWidget().getChildTabViewAt(tabIndex);
            var t = tab.getChildAt(1);
            t.setTextColor(constants.btn_default);
        }
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
    SearchBarStyler.getBackgroundColorProperty = function (view) {
        var bar = view.android;
        return bar.getDrawingCacheBackgroundColor();
    };
    SearchBarStyler.setBackgroundColorProperty = function (view, newValue) {
        var bar = view.android;
        bar.setBackgroundColor(newValue);
        SearchBarStyler._changeSearchViewPlateBackgroundColor(bar, newValue);
    };
    SearchBarStyler.resetBackgroundColorProperty = function (view, nativeValue) {
        var bar = view.android;
        bar.setBackgroundColor(nativeValue);
        SearchBarStyler._changeSearchViewPlateBackgroundColor(bar, nativeValue);
    };
    SearchBarStyler.getColorProperty = function (view) {
        var bar = view.android;
        var textView = SearchBarStyler._getSearchViewTextView(bar);
        if (textView) {
            return textView.getCurrentTextColor();
        }
        return undefined;
    };
    SearchBarStyler.setColorProperty = function (view, newValue) {
        var bar = view.android;
        SearchBarStyler._changeSearchViewTextColor(bar, newValue);
    };
    SearchBarStyler.resetColorProperty = function (view, nativeValue) {
        var bar = view.android;
        SearchBarStyler._changeSearchViewTextColor(bar, nativeValue);
    };
    SearchBarStyler.registerHandlers = function () {
        style.registerHandler(style.backgroundColorProperty, new stylersCommon.StylePropertyChangedHandler(SearchBarStyler.setBackgroundColorProperty, SearchBarStyler.resetBackgroundColorProperty, SearchBarStyler.getBackgroundColorProperty), "SearchBar");
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(SearchBarStyler.setColorProperty, SearchBarStyler.resetColorProperty, SearchBarStyler.getColorProperty), "SearchBar");
    };
    SearchBarStyler._getSearchViewTextView = function (bar) {
        var id = bar.getContext().getResources().getIdentifier("android:id/search_src_text", null, null);
        return bar.findViewById(id);
    };
    SearchBarStyler._changeSearchViewTextColor = function (bar, color) {
        var textView = SearchBarStyler._getSearchViewTextView(bar);
        if (textView) {
            textView.setTextColor(color);
        }
    };
    SearchBarStyler._changeSearchViewPlateBackgroundColor = function (bar, color) {
        var id = bar.getContext().getResources().getIdentifier("android:id/search_plate", null, null);
        var textView = bar.findViewById(id);
        if (textView) {
            textView.setBackgroundColor(color);
        }
    };
    return SearchBarStyler;
})();
exports.SearchBarStyler = SearchBarStyler;
function _registerDefaultStylers() {
    style.registerNoStylingClass("Frame");
    DefaultStyler.registerHandlers();
    TextViewStyler.registerHandlers();
    ActivityIndicatorStyler.registerHandlers();
    SegmentedBarStyler.registerHandlers();
    SearchBarStyler.registerHandlers();
}
exports._registerDefaultStylers = _registerDefaultStylers;
