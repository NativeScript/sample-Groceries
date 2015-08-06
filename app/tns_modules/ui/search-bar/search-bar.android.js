var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/search-bar/search-bar-common");
var color = require("color");
var types = require("utils/types");
var SEARCHTEXT = "searchText";
var QUERY = "query";
var EMPTY = "";
function onTextPropertyChanged(data) {
    var bar = data.object;
    if (!bar.android) {
        return;
    }
    bar.android.setQuery(data.newValue, false);
}
common.SearchBar.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;
function onTextFieldBackgroundColorPropertyChanged(data) {
    var bar = data.object;
    if (!bar.android) {
        return;
    }
    if (data.newValue instanceof color.Color) {
        _changeSearchViewBackgroundColor(bar.android, data.newValue.android);
    }
}
common.SearchBar.textFieldBackgroundColorProperty.metadata.onSetNativeValue = onTextFieldBackgroundColorPropertyChanged;
function onTextFieldHintColorPropertyChanged(data) {
    var bar = data.object;
    if (!bar.android) {
        return;
    }
    if (data.newValue instanceof color.Color) {
        _changeSearchViewHintColor(bar.android, data.newValue.android);
    }
}
common.SearchBar.textFieldHintColorProperty.metadata.onSetNativeValue = onTextFieldHintColorPropertyChanged;
function onHintPropertyChanged(data) {
    var bar = data.object;
    if (!bar.android) {
        return;
    }
    var newValue = data.newValue;
    if (types.isString(newValue)) {
        bar.android.setQueryHint(newValue);
    }
}
common.SearchBar.hintProperty.metadata.onSetNativeValue = onHintPropertyChanged;
function getTextView(bar) {
    if (bar) {
        var id = bar.getContext().getResources().getIdentifier("android:id/search_src_text", null, null);
        if (id) {
            return bar.findViewById(id);
        }
    }
    return undefined;
}
function _changeSearchViewBackgroundColor(bar, color) {
    var textView = getTextView(bar);
    if (textView) {
        textView.setBackgroundColor(color);
    }
}
function _changeSearchViewHintColor(bar, color) {
    var textView = getTextView(bar);
    if (textView) {
        textView.setHintTextColor(color);
    }
}
require("utils/module-merge").merge(common, exports);
var SearchBar = (function (_super) {
    __extends(SearchBar, _super);
    function SearchBar() {
        _super.apply(this, arguments);
    }
    SearchBar.prototype._createUI = function () {
        this._android = new android.widget.SearchView(this._context);
        this._android.setIconified(false);
        var that = new WeakRef(this);
        this._android.setOnQueryTextListener(new android.widget.SearchView.OnQueryTextListener({
            get owner() {
                return that.get();
            },
            onQueryTextChange: function (newText) {
                if (this.owner) {
                    this.owner._onPropertyChangedFromNative(common.SearchBar.textProperty, newText);
                    if (newText === EMPTY && this[SEARCHTEXT] !== newText) {
                        this.owner._emit(common.SearchBar.clearEvent);
                    }
                    this[SEARCHTEXT] = newText;
                }
                return true;
            },
            onQueryTextSubmit: function (query) {
                if (this.owner) {
                    if (query !== EMPTY && this[QUERY] !== query) {
                        this.owner._emit(common.SearchBar.submitEvent);
                    }
                    this[QUERY] = query;
                }
                return true;
            }
        }));
        this._android.setOnCloseListener(new android.widget.SearchView.OnCloseListener({
            get owner() {
                return that.get();
            },
            onClose: function () {
                if (this.owner) {
                    this.owner._emit(common.SearchBar.clearEvent);
                }
                return true;
            }
        }));
        if (this.textFieldBackgroundColor instanceof color.Color) {
            _changeSearchViewBackgroundColor(this._android, this.textFieldBackgroundColor.android);
        }
        if (this.textFieldHintColor instanceof color.Color) {
            _changeSearchViewHintColor(this._android, this.textFieldHintColor.android);
        }
    };
    Object.defineProperty(SearchBar.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    return SearchBar;
})(common.SearchBar);
exports.SearchBar = SearchBar;
