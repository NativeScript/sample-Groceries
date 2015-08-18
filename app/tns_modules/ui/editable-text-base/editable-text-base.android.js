var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/editable-text-base/editable-text-base-common");
var textBase = require("ui/text-base");
var enums = require("ui/enums");
var EditableTextBase = (function (_super) {
    __extends(EditableTextBase, _super);
    function EditableTextBase(options) {
        _super.call(this, options);
    }
    Object.defineProperty(EditableTextBase.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    EditableTextBase.prototype._createUI = function () {
        this._imm = this._context.getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
        this._android = new android.widget.EditText(this._context);
        this._configureEditText();
        this.android.setTag(this.android.getKeyListener());
        var that = new WeakRef(this);
        var textWatcher = new android.text.TextWatcher({
            beforeTextChanged: function (text, start, count, after) {
            },
            onTextChanged: function (text, start, before, count) {
            },
            afterTextChanged: function (editable) {
                var owner = that.get();
                if (!owner) {
                    return;
                }
                switch (owner.updateTextTrigger) {
                    case enums.UpdateTextTrigger.focusLost:
                        owner._dirtyTextAccumulator = editable.toString();
                        break;
                    case enums.UpdateTextTrigger.textChanged:
                        owner._onPropertyChangedFromNative(textBase.TextBase.textProperty, editable.toString());
                        break;
                    default:
                        throw new Error("Invalid updateTextTrigger: " + owner.updateTextTrigger);
                        break;
                }
            }
        });
        this._android.addTextChangedListener(textWatcher);
        var focusChangeListener = new android.view.View.OnFocusChangeListener({
            onFocusChange: function (view, hasFocus) {
                var owner = that.get();
                if (!owner) {
                    return;
                }
                if (!hasFocus) {
                    if (owner._dirtyTextAccumulator) {
                        owner._onPropertyChangedFromNative(textBase.TextBase.textProperty, owner._dirtyTextAccumulator);
                        owner._dirtyTextAccumulator = undefined;
                    }
                    owner.dismissSoftInput();
                }
            }
        });
        this._android.setOnFocusChangeListener(focusChangeListener);
        var editorActionListener = new android.widget.TextView.OnEditorActionListener({
            onEditorAction: function (textView, actionId, event) {
                var owner = that.get();
                if (owner) {
                    if (actionId === android.view.inputmethod.EditorInfo.IME_ACTION_DONE ||
                        actionId === android.view.inputmethod.EditorInfo.IME_ACTION_GO ||
                        actionId === android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH ||
                        actionId === android.view.inputmethod.EditorInfo.IME_ACTION_SEND) {
                        owner.dismissSoftInput();
                    }
                }
                return false;
            }
        });
        this._android.setOnEditorActionListener(editorActionListener);
    };
    EditableTextBase.prototype._configureEditText = function () {
    };
    EditableTextBase.prototype._onDetached = function (force) {
        this._imm = undefined;
        this._android = undefined;
        _super.prototype._onDetached.call(this, force);
    };
    EditableTextBase.prototype.dismissSoftInput = function () {
        if (this._imm) {
            this._imm.hideSoftInputFromWindow(this._android.getWindowToken(), 0);
        }
    };
    EditableTextBase.prototype.focus = function () {
        var result = _super.prototype.focus.call(this);
        if (result && this._nativeView) {
            this._imm.showSoftInput(this._nativeView, android.view.inputmethod.InputMethodManager.SHOW_IMPLICIT);
        }
        return result;
    };
    EditableTextBase.prototype._onTextPropertyChanged = function (data) {
        if (this._android) {
            this.android.setText(data.newValue + "", android.widget.TextView.BufferType.EDITABLE);
        }
    };
    EditableTextBase.prototype._onKeyboardTypePropertyChanged = function (data) {
        if (!this._android) {
            return;
        }
        var newInputType;
        switch (data.newValue) {
            case enums.KeyboardType.datetime:
                newInputType = android.text.InputType.TYPE_CLASS_DATETIME | android.text.InputType.TYPE_DATETIME_VARIATION_NORMAL;
                break;
            case enums.KeyboardType.phone:
                newInputType = android.text.InputType.TYPE_CLASS_PHONE;
                break;
            case enums.KeyboardType.number:
                newInputType = android.text.InputType.TYPE_CLASS_NUMBER | android.text.InputType.TYPE_NUMBER_VARIATION_NORMAL | android.text.InputType.TYPE_NUMBER_FLAG_SIGNED | android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL;
                break;
            case enums.KeyboardType.url:
                newInputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_URI;
                break;
            case enums.KeyboardType.email:
                newInputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS;
                break;
            default:
                newInputType = android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_NORMAL;
                break;
        }
        this._android.setInputType(newInputType);
    };
    EditableTextBase.prototype._onReturnKeyTypePropertyChanged = function (data) {
        if (!this._android) {
            return;
        }
        var newImeOptions;
        switch (data.newValue) {
            case enums.ReturnKeyType.done:
                newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_DONE;
                break;
            case enums.ReturnKeyType.go:
                newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_GO;
                break;
            case enums.ReturnKeyType.next:
                newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_NEXT;
                break;
            case enums.ReturnKeyType.search:
                newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH;
                break;
            case enums.ReturnKeyType.send:
                newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_SEND;
                break;
            default:
                newImeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_UNSPECIFIED;
                break;
        }
        this._android.setImeOptions(newImeOptions);
    };
    EditableTextBase.prototype._onEditablePropertyChanged = function (data) {
        if (!this._android) {
            return;
        }
        if (data.newValue) {
            this.android.setKeyListener(this.android.getTag());
        }
        else {
            this.android.setKeyListener(null);
        }
    };
    EditableTextBase.prototype._onAutocapitalizationTypePropertyChanged = function (data) {
        var editableTextBase = data.object;
        if (!editableTextBase.android) {
            return;
        }
        var inputType = editableTextBase.android.getInputType();
        inputType = inputType & ~28762;
        switch (data.newValue) {
            case enums.AutocapitalizationType.none:
                break;
            case enums.AutocapitalizationType.words:
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_WORDS;
                break;
            case enums.AutocapitalizationType.sentences:
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES;
                break;
            case enums.AutocapitalizationType.allCharacters:
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS;
                break;
            default:
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_CAP_SENTENCES;
                break;
        }
        editableTextBase.android.setInputType(inputType);
    };
    EditableTextBase.prototype._onAutocorrectPropertyChanged = function (data) {
        var editableTextBase = data.object;
        if (!editableTextBase.android) {
            return;
        }
        var inputType = editableTextBase.android.getInputType();
        switch (data.newValue) {
            case true:
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_AUTO_COMPLETE;
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_AUTO_CORRECT;
                inputType = inputType & ~android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS;
                break;
            case false:
                inputType = inputType & ~android.text.InputType.TYPE_TEXT_FLAG_AUTO_COMPLETE;
                inputType = inputType & ~android.text.InputType.TYPE_TEXT_FLAG_AUTO_CORRECT;
                inputType = inputType | android.text.InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS;
                break;
            default:
                break;
        }
        editableTextBase.android.setInputType(inputType);
    };
    EditableTextBase.prototype._onHintPropertyChanged = function (data) {
        var editableTextBase = data.object;
        if (!editableTextBase.android) {
            return;
        }
        editableTextBase.android.setHint(data.newValue);
    };
    return EditableTextBase;
})(common.EditableTextBase);
exports.EditableTextBase = EditableTextBase;
