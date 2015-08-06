var view = require("ui/core/view");
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var color = require("color");
var SearchBar = (function (_super) {
    __extends(SearchBar, _super);
    function SearchBar() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(SearchBar.prototype, "text", {
        get: function () {
            return this._getValue(SearchBar.textProperty);
        },
        set: function (value) {
            this._setValue(SearchBar.textProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, "hint", {
        get: function () {
            return this._getValue(SearchBar.hintProperty);
        },
        set: function (value) {
            this._setValue(SearchBar.hintProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, "textFieldBackgroundColor", {
        get: function () {
            return this._getValue(SearchBar.textFieldBackgroundColorProperty);
        },
        set: function (value) {
            this._setValue(SearchBar.textFieldBackgroundColorProperty, value instanceof color.Color ? value : new color.Color(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SearchBar.prototype, "textFieldHintColor", {
        get: function () {
            return this._getValue(SearchBar.textFieldHintColorProperty);
        },
        set: function (value) {
            this._setValue(SearchBar.textFieldHintColorProperty, value instanceof color.Color ? value : new color.Color(value));
        },
        enumerable: true,
        configurable: true
    });
    SearchBar.submitEvent = "submit";
    SearchBar.clearEvent = "clear";
    SearchBar.textFieldBackgroundColorProperty = new dependencyObservable.Property("textFieldBackgroundColor", "SearchBar", new proxy.PropertyMetadata(undefined));
    SearchBar.textFieldHintColorProperty = new dependencyObservable.Property("textFieldHintColor", "SearchBar", new proxy.PropertyMetadata(undefined));
    SearchBar.hintProperty = new dependencyObservable.Property("hint", "SearchBar", new proxy.PropertyMetadata(""));
    SearchBar.textProperty = new dependencyObservable.Property("text", "SearchBar", new proxy.PropertyMetadata("", dependencyObservable.PropertyMetadataSettings.AffectsLayout));
    return SearchBar;
})(view.View);
exports.SearchBar = SearchBar;
