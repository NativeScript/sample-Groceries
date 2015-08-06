var common = require("ui/editable-text-base/editable-text-base-common");
var enums = require("ui/enums");
var EditableTextBase = (function (_super) {
    __extends(EditableTextBase, _super);
    function EditableTextBase(options) {
        _super.call(this, options);
    }
    EditableTextBase.prototype.dismissSoftInput = function () {
        this.ios.resignFirstResponder();
    };
    EditableTextBase.prototype._onKeyboardTypePropertyChanged = function (data) {
        var newKeyboardType;
        switch (data.newValue) {
            case enums.KeyboardType.datetime:
                newKeyboardType = UIKeyboardType.UIKeyboardTypeNumbersAndPunctuation;
                break;
            case enums.KeyboardType.phone:
                newKeyboardType = UIKeyboardType.UIKeyboardTypePhonePad;
                break;
            case enums.KeyboardType.number:
                newKeyboardType = UIKeyboardType.UIKeyboardTypeNumbersAndPunctuation;
                break;
            case enums.KeyboardType.url:
                newKeyboardType = UIKeyboardType.UIKeyboardTypeURL;
                break;
            case enums.KeyboardType.email:
                newKeyboardType = UIKeyboardType.UIKeyboardTypeEmailAddress;
                break;
            default:
                newKeyboardType = UIKeyboardType.UIKeyboardTypeDefault;
                break;
        }
        this.ios.keyboardType = newKeyboardType;
    };
    EditableTextBase.prototype._onReturnKeyTypePropertyChanged = function (data) {
        var newValue;
        switch (data.newValue) {
            case enums.ReturnKeyType.done:
                newValue = UIReturnKeyType.UIReturnKeyDone;
                break;
            case enums.ReturnKeyType.go:
                newValue = UIReturnKeyType.UIReturnKeyGo;
                break;
            case enums.ReturnKeyType.next:
                newValue = UIReturnKeyType.UIReturnKeyNext;
                break;
            case enums.ReturnKeyType.search:
                newValue = UIReturnKeyType.UIReturnKeySearch;
                break;
            case enums.ReturnKeyType.send:
                newValue = UIReturnKeyType.UIReturnKeySend;
                break;
            default:
                newValue = UIReturnKeyType.UIReturnKeyDefault;
                break;
        }
        this.ios.returnKeyType = newValue;
    };
    EditableTextBase.prototype._onAutocapitalizationTypePropertyChanged = function (data) {
        var newValue;
        switch (data.newValue) {
            case enums.AutocapitalizationType.none:
                newValue = UITextAutocapitalizationType.UITextAutocapitalizationTypeNone;
                break;
            case enums.AutocapitalizationType.words:
                newValue = UITextAutocapitalizationType.UITextAutocapitalizationTypeWords;
                break;
            case enums.AutocapitalizationType.sentences:
                newValue = UITextAutocapitalizationType.UITextAutocapitalizationTypeSentences;
                break;
            case enums.AutocapitalizationType.allCharacters:
                newValue = UITextAutocapitalizationType.UITextAutocapitalizationTypeAllCharacters;
                break;
            default:
                newValue = UITextAutocapitalizationType.UITextAutocapitalizationTypeSentences;
                break;
        }
        this.ios.autocapitalizationType = newValue;
    };
    EditableTextBase.prototype._onAutocorrectPropertyChanged = function (data) {
        var newValue;
        switch (data.newValue) {
            case true:
                newValue = UITextAutocorrectionType.UITextAutocorrectionTypeYes;
                break;
            case false:
                newValue = UITextAutocorrectionType.UITextAutocorrectionTypeNo;
                break;
            default:
                newValue = UITextAutocorrectionType.UITextAutocorrectionTypeDefault;
                break;
        }
        this.ios.autocorrectionType = newValue;
    };
    return EditableTextBase;
})(common.EditableTextBase);
exports.EditableTextBase = EditableTextBase;
