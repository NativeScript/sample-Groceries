var view = require("ui/core/view");
var enums = require("ui/enums");
var common = require("ui/layouts/dock-layout/dock-layout-common");
global.moduleMerge(common, exports);
function setNativeDockProperty(data) {
    var uiView = data.object;
    if (uiView instanceof view.View) {
        var nativeView = uiView._nativeView;
        var lp = nativeView.getLayoutParams();
        if (!(lp instanceof org.nativescript.widgets.CommonLayoutParams)) {
            lp = new org.nativescript.widgets.CommonLayoutParams();
        }
        switch (data.newValue) {
            case enums.Dock.left:
                lp.dock = org.nativescript.widgets.Dock.left;
                break;
            case enums.Dock.top:
                lp.dock = org.nativescript.widgets.Dock.top;
                break;
            case enums.Dock.right:
                lp.dock = org.nativescript.widgets.Dock.right;
                break;
            case enums.Dock.bottom:
                lp.dock = org.nativescript.widgets.Dock.bottom;
                break;
            default:
                throw new Error("Invalid dock value: " + data.newValue + " on element: " + uiView);
        }
        nativeView.setLayoutParams(lp);
    }
}
common.DockLayout.dockProperty.metadata.onSetNativeValue = setNativeDockProperty;
var DockLayout = (function (_super) {
    __extends(DockLayout, _super);
    function DockLayout() {
        _super.apply(this, arguments);
    }
    DockLayout.setNativeStretchLastChildProperty = function (data) {
        var dockLayout = data.object;
        var nativeView = dockLayout._nativeView;
        nativeView.setStretchLastChild(data.newValue);
    };
    Object.defineProperty(DockLayout.prototype, "android", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DockLayout.prototype, "_nativeView", {
        get: function () {
            return this._layout;
        },
        enumerable: true,
        configurable: true
    });
    DockLayout.prototype._createUI = function () {
        this._layout = new org.nativescript.widgets.DockLayout(this._context);
    };
    return DockLayout;
})(common.DockLayout);
exports.DockLayout = DockLayout;
common.DockLayout.stretchLastChildProperty.metadata.onSetNativeValue = DockLayout.setNativeStretchLastChildProperty;
