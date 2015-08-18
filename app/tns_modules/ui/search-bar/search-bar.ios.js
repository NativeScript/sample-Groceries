var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/search-bar/search-bar-common");
var color = require("color");
var types = require("utils/types");
function onTextPropertyChanged(data) {
    var bar = data.object;
    bar.ios.text = data.newValue;
}
common.SearchBar.textProperty.metadata.onSetNativeValue = onTextPropertyChanged;
function onTextFieldBackgroundColorPropertyChanged(data) {
    var bar = data.object;
    if (data.newValue instanceof color.Color) {
        var tf = getUITextField(bar.ios);
        if (tf) {
            tf.backgroundColor = data.newValue.ios;
        }
    }
}
common.SearchBar.textFieldBackgroundColorProperty.metadata.onSetNativeValue = onTextFieldBackgroundColorPropertyChanged;
function onTextFieldHintColorPropertyChanged(data) {
    try {
    }
    catch (Err) {
    }
}
common.SearchBar.textFieldHintColorProperty.metadata.onSetNativeValue = onTextFieldHintColorPropertyChanged;
function onHintPropertyChanged(data) {
    var bar = data.object;
    if (!bar.ios) {
        return;
    }
    var newValue = data.newValue;
    if (types.isString(newValue)) {
        bar.ios.placeholder = newValue;
    }
}
common.SearchBar.hintProperty.metadata.onSetNativeValue = onHintPropertyChanged;
function getUITextField(bar) {
    if (bar) {
        return bar.valueForKey("_searchField");
    }
    return undefined;
}
require("utils/module-merge").merge(common, exports);
var UISearchBarDelegateImpl = (function (_super) {
    __extends(UISearchBarDelegateImpl, _super);
    function UISearchBarDelegateImpl() {
        _super.apply(this, arguments);
    }
    UISearchBarDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    UISearchBarDelegateImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    UISearchBarDelegateImpl.prototype.searchBarTextDidChange = function (searchBar, searchText) {
        this._owner._onPropertyChangedFromNative(common.SearchBar.textProperty, searchText);
        if (searchText === "" && this._searchText !== searchText) {
            this._owner._emit(common.SearchBar.clearEvent);
        }
        this._searchText = searchText;
    };
    UISearchBarDelegateImpl.prototype.searchBarCancelButtonClicked = function (searchBar) {
        searchBar.resignFirstResponder();
        this._owner._emit(common.SearchBar.clearEvent);
    };
    UISearchBarDelegateImpl.prototype.searchBarSearchButtonClicked = function (searchBar) {
        searchBar.resignFirstResponder();
        this._owner._emit(common.SearchBar.submitEvent);
    };
    UISearchBarDelegateImpl.ObjCProtocols = [UISearchBarDelegate];
    return UISearchBarDelegateImpl;
})(NSObject);
var SearchBar = (function (_super) {
    __extends(SearchBar, _super);
    function SearchBar() {
        _super.call(this);
        this._ios = new UISearchBar();
        this._delegate = UISearchBarDelegateImpl.new().initWithOwner(this);
    }
    SearchBar.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._ios.delegate = this._delegate;
    };
    SearchBar.prototype.onUnloaded = function () {
        this._ios.delegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(SearchBar.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return SearchBar;
})(common.SearchBar);
exports.SearchBar = SearchBar;
