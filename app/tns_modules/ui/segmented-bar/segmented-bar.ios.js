var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var common = require("ui/segmented-bar/segmented-bar-common");
var types = require("utils/types");
var color = require("color");
require("utils/module-merge").merge(common, exports);
function onSelectedIndexPropertyChanged(data) {
    var view = data.object;
    if (!view.ios || !view.items) {
        return;
    }
    var index = data.newValue;
    if (types.isNumber(index)) {
        if (index >= 0 && index <= view.items.length - 1) {
            view.ios.selectedSegmentIndex = index;
        }
        else {
            view.selectedIndex = undefined;
            throw new Error("selectedIndex should be between [0, items.length - 1]");
        }
    }
}
common.SegmentedBar.selectedIndexProperty.metadata.onSetNativeValue = onSelectedIndexPropertyChanged;
function onItemsPropertyChanged(data) {
    var view = data.object;
    if (!view.ios) {
        return;
    }
    var newItems = data.newValue;
    view._adjustSelectedIndex(newItems);
    view.ios.removeAllSegments();
    if (newItems && newItems.length) {
        for (var i = 0; i < newItems.length; i++) {
            view.ios.insertSegmentWithTitleAtIndexAnimated(newItems[i].title, i, false);
        }
        if (view.ios.selectedSegmentIndex !== view.selectedIndex) {
            view.ios.selectedSegmentIndex = view.selectedIndex;
        }
    }
}
common.SegmentedBar.itemsProperty.metadata.onSetNativeValue = onItemsPropertyChanged;
function onSelectedBackgroundColorPropertyChanged(data) {
    var view = data.object;
    if (!view.ios) {
        return;
    }
    if (data.newValue instanceof color.Color) {
        view.ios.tintColor = data.newValue.ios;
    }
}
common.SegmentedBar.selectedBackgroundColorProperty.metadata.onSetNativeValue = onSelectedBackgroundColorPropertyChanged;
var SegmentedBar = (function (_super) {
    __extends(SegmentedBar, _super);
    function SegmentedBar() {
        _super.call(this);
        this._ios = UISegmentedControl.new();
        this._selectionHandler = SelectionHandlerImpl.new().initWithOwner(this);
        this._ios.addTargetActionForControlEvents(this._selectionHandler, "selected", UIControlEvents.UIControlEventValueChanged);
    }
    Object.defineProperty(SegmentedBar.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return SegmentedBar;
})(common.SegmentedBar);
exports.SegmentedBar = SegmentedBar;
var SelectionHandlerImpl = (function (_super) {
    __extends(SelectionHandlerImpl, _super);
    function SelectionHandlerImpl() {
        _super.apply(this, arguments);
    }
    SelectionHandlerImpl.new = function () {
        return _super.new.call(this);
    };
    SelectionHandlerImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    SelectionHandlerImpl.prototype.selected = function (sender) {
        this._owner.selectedIndex = sender.selectedSegmentIndex;
    };
    SelectionHandlerImpl.ObjCExposedMethods = {
        "selected": { returns: interop.types.void, params: [UISegmentedControl] }
    };
    return SelectionHandlerImpl;
})(NSObject);
