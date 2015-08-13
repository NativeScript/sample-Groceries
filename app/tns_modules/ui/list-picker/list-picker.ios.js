var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/list-picker/list-picker-common");
var types = require("utils/types");
require("utils/module-merge").merge(common, exports);
var ListPicker = (function (_super) {
    __extends(ListPicker, _super);
    function ListPicker() {
        _super.call(this);
        this._ios = new UIPickerView();
        var dataSource = ListPickerDataSource.new().initWithOwner(this);
        this._dataSource = dataSource;
        this._ios.dataSource = this._dataSource;
        this._delegate = ListPickerDelegateImpl.new().initWithOwner(this);
    }
    ListPicker.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._ios.delegate = this._delegate;
    };
    ListPicker.prototype.onUnloaded = function () {
        this._ios.delegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(ListPicker.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    ListPicker.prototype._onSelectedIndexPropertyChanged = function (data) {
        _super.prototype._onSelectedIndexPropertyChanged.call(this, data);
        if (this.ios && types.isNumber(data.newValue)) {
            this.ios.selectRowInComponentAnimated(data.newValue, 0, false);
        }
    };
    ListPicker.prototype._onItemsPropertyChanged = function (data) {
        if (this.ios) {
            this.ios.reloadAllComponents();
        }
        this._updateSelectedIndexOnItemsPropertyChanged(data.newValue);
    };
    return ListPicker;
})(common.ListPicker);
exports.ListPicker = ListPicker;
var ListPickerDataSource = (function (_super) {
    __extends(ListPickerDataSource, _super);
    function ListPickerDataSource() {
        _super.apply(this, arguments);
    }
    ListPickerDataSource.new = function () {
        return _super.new.call(this);
    };
    ListPickerDataSource.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    ListPickerDataSource.prototype.numberOfComponentsInPickerView = function (pickerView) {
        return 1;
    };
    ListPickerDataSource.prototype.pickerViewNumberOfRowsInComponent = function (pickerView, component) {
        return this._owner.items ? this._owner.items.length : 0;
    };
    ListPickerDataSource.ObjCProtocols = [UIPickerViewDataSource];
    return ListPickerDataSource;
})(NSObject);
var ListPickerDelegateImpl = (function (_super) {
    __extends(ListPickerDelegateImpl, _super);
    function ListPickerDelegateImpl() {
        _super.apply(this, arguments);
    }
    ListPickerDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    ListPickerDelegateImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    ListPickerDelegateImpl.prototype.pickerViewTitleForRowForComponent = function (pickerView, row, component) {
        if (this._owner) {
            return this._owner._getItemAsString(row);
        }
        return row.toString();
    };
    ListPickerDelegateImpl.prototype.pickerViewDidSelectRowInComponent = function (pickerView, row, component) {
        if (this._owner) {
            this._owner._onPropertyChangedFromNative(common.ListPicker.selectedIndexProperty, row);
        }
    };
    ListPickerDelegateImpl.ObjCProtocols = [UIPickerViewDelegate];
    return ListPickerDelegateImpl;
})(NSObject);
