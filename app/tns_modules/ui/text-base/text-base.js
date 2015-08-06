var view = require("ui/core/view");
var observable = require("data/observable");
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var weakEvents = require("ui/core/weak-event-listener");
var textProperty = new dependencyObservable.Property("text", "TextBase", new proxy.PropertyMetadata("", dependencyObservable.PropertyMetadataSettings.AffectsLayout));
var formattedTextProperty = new dependencyObservable.Property("formattedText", "TextBase", new proxy.PropertyMetadata("", dependencyObservable.PropertyMetadataSettings.AffectsLayout));
function onTextPropertyChanged(data) {
    var textBase = data.object;
    textBase._onTextPropertyChanged(data);
}
textProperty.metadata.onSetNativeValue = onTextPropertyChanged;
function onFormattedTextPropertyChanged(data) {
    var textBase = data.object;
    textBase._onFormattedTextPropertyChanged(data);
}
formattedTextProperty.metadata.onSetNativeValue = onFormattedTextPropertyChanged;
var TextBase = (function (_super) {
    __extends(TextBase, _super);
    function TextBase(options) {
        _super.call(this, options);
    }
    TextBase.prototype._onBindingContextChanged = function (oldValue, newValue) {
        _super.prototype._onBindingContextChanged.call(this, oldValue, newValue);
        if (this.formattedText) {
            this.formattedText.updateSpansBindingContext(newValue);
        }
    };
    Object.defineProperty(TextBase.prototype, "text", {
        get: function () {
            return this._getValue(TextBase.textProperty);
        },
        set: function (value) {
            this._setValue(TextBase.textProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, "fontSize", {
        get: function () {
            return this.style.fontSize;
        },
        set: function (value) {
            this.style.fontSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, "textAlignment", {
        get: function () {
            return this.style.textAlignment;
        },
        set: function (value) {
            this.style.textAlignment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextBase.prototype, "formattedText", {
        get: function () {
            return this._getValue(TextBase.formattedTextProperty);
        },
        set: function (value) {
            if (this.formattedText !== value) {
                if (this.formattedText) {
                    weakEvents.removeWeakEventListener(this.formattedText, observable.Observable.propertyChangeEvent, this.onFormattedTextChanged, this);
                }
                this._setValue(TextBase.formattedTextProperty, value);
                if (value) {
                    weakEvents.addWeakEventListener(value, observable.Observable.propertyChangeEvent, this.onFormattedTextChanged, this);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    TextBase.prototype.onFormattedTextChanged = function (eventData) {
        this.setFormattedTextPropertyToNative(eventData.value);
    };
    TextBase.prototype._onTextPropertyChanged = function (data) {
        if (this.android) {
            this.android.setText(data.newValue + "");
        }
        else if (this.ios) {
            this.ios.text = data.newValue + "";
        }
    };
    TextBase.prototype.setFormattedTextPropertyToNative = function (value) {
        if (this.android) {
            this.android.setText(value._formattedText);
        }
        else if (this.ios) {
            this.ios.attributedText = value._formattedText;
            this.requestLayout();
        }
    };
    TextBase.prototype._onFormattedTextPropertyChanged = function (data) {
        if (data.newValue) {
            data.newValue.parent = this;
        }
        this.setFormattedTextPropertyToNative(data.newValue);
    };
    TextBase.textProperty = textProperty;
    TextBase.formattedTextProperty = formattedTextProperty;
    return TextBase;
})(view.View);
exports.TextBase = TextBase;
