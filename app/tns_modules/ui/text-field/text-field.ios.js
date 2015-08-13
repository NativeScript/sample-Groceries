var common = require("ui/text-field/text-field-common");
var textBase = require("ui/text-base");
var enums = require("ui/enums");
function onSecurePropertyChanged(data) {
    var textField = data.object;
    textField.ios.secureTextEntry = data.newValue;
}
common.secureProperty.metadata.onSetNativeValue = onSecurePropertyChanged;
global.moduleMerge(common, exports);
var UITextFieldDelegateImpl = (function (_super) {
    __extends(UITextFieldDelegateImpl, _super);
    function UITextFieldDelegateImpl() {
        _super.apply(this, arguments);
    }
    UITextFieldDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    UITextFieldDelegateImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldBeginEditing = function (textField) {
        this.firstEdit = true;
        return this._owner.editable;
    };
    UITextFieldDelegateImpl.prototype.textFieldDidEndEditing = function (textField) {
        if (this._owner.updateTextTrigger === enums.UpdateTextTrigger.focusLost) {
            this._owner._onPropertyChangedFromNative(textBase.TextBase.textProperty, textField.text);
        }
        this._owner.dismissSoftInput();
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldClear = function (textField) {
        this.firstEdit = false;
        this._owner._onPropertyChangedFromNative(textBase.TextBase.textProperty, "");
        return true;
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldReturn = function (textField) {
        this._owner.dismissSoftInput();
        return true;
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldChangeCharactersInRangeReplacementString = function (textField, range, replacementString) {
        if (this._owner.updateTextTrigger === enums.UpdateTextTrigger.textChanged) {
            if (textField.secureTextEntry && this.firstEdit) {
                this._owner._onPropertyChangedFromNative(textBase.TextBase.textProperty, replacementString);
            }
            else {
                var newText = NSString.alloc().initWithString(textField.text).stringByReplacingCharactersInRangeWithString(range, replacementString);
                this._owner._onPropertyChangedFromNative(textBase.TextBase.textProperty, newText);
            }
        }
        this.firstEdit = false;
        return true;
    };
    UITextFieldDelegateImpl.ObjCProtocols = [UITextFieldDelegate];
    return UITextFieldDelegateImpl;
})(NSObject);
var UITextFieldImpl = (function (_super) {
    __extends(UITextFieldImpl, _super);
    function UITextFieldImpl() {
        _super.apply(this, arguments);
    }
    UITextFieldImpl.new = function () {
        return _super.new.call(this);
    };
    UITextFieldImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    UITextFieldImpl.prototype._getTextRectForBounds = function (bounds) {
        if (!this._owner) {
            return bounds;
        }
        return CGRectMake(this._owner.borderWidth + this._owner.style.paddingLeft, this._owner.borderWidth + this._owner.style.paddingTop, bounds.size.width - (this._owner.borderWidth + this._owner.style.paddingLeft + this._owner.style.paddingRight + this._owner.borderWidth), bounds.size.height - (this._owner.borderWidth + this._owner.style.paddingTop + this._owner.style.paddingBottom + this._owner.borderWidth));
    };
    UITextFieldImpl.prototype.textRectForBounds = function (bounds) {
        return this._getTextRectForBounds(bounds);
    };
    UITextFieldImpl.prototype.editingRectForBounds = function (bounds) {
        return this._getTextRectForBounds(bounds);
    };
    return UITextFieldImpl;
})(UITextField);
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.call(this);
        this._ios = UITextFieldImpl.new().initWithOwner(this);
        this._delegate = UITextFieldDelegateImpl.new().initWithOwner(this);
    }
    TextField.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._ios.delegate = this._delegate;
    };
    TextField.prototype.onUnloaded = function () {
        this._ios.delegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(TextField.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    TextField.prototype._onHintPropertyChanged = function (data) {
        var textField = data.object;
        textField.ios.placeholder = data.newValue;
    };
    return TextField;
})(common.TextField);
exports.TextField = TextField;
