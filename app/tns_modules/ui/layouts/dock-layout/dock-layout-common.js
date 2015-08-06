var layouts = require("ui/layouts/layout-base");
var dependencyObservable = require("ui/core/dependency-observable");
var view = require("ui/core/view");
var enums = require("ui/enums");
var proxy = require("ui/core/proxy");
var AffectsLayout = global.android ? dependencyObservable.PropertyMetadataSettings.None : dependencyObservable.PropertyMetadataSettings.AffectsLayout;
function isDockValid(value) {
    return value === enums.Dock.left || value === enums.Dock.top || value === enums.Dock.right || value === enums.Dock.bottom;
}
function validateArgs(element) {
    if (!element) {
        throw new Error("element cannot be null or undefinied.");
    }
    return element;
}
var DockLayout = (function (_super) {
    __extends(DockLayout, _super);
    function DockLayout() {
        _super.apply(this, arguments);
    }
    DockLayout.onDockPropertyChanged = function (data) {
        var uiView = data.object;
        if (uiView instanceof view.View) {
            var layout = uiView.parent;
            if (layout instanceof DockLayout) {
                layout.onDockChanged(uiView, data.oldValue, data.newValue);
            }
        }
    };
    DockLayout.getDock = function (element) {
        return validateArgs(element)._getValue(DockLayout.dockProperty);
    };
    DockLayout.setDock = function (element, value) {
        validateArgs(element)._setValue(DockLayout.dockProperty, value);
    };
    Object.defineProperty(DockLayout.prototype, "stretchLastChild", {
        get: function () {
            return this._getValue(DockLayout.stretchLastChildProperty);
        },
        set: function (value) {
            this._setValue(DockLayout.stretchLastChildProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    DockLayout.prototype.onDockChanged = function (view, oldValue, newValue) {
    };
    DockLayout.dockProperty = new dependencyObservable.Property("dock", "DockLayout", new proxy.PropertyMetadata(enums.Dock.left, undefined, DockLayout.onDockPropertyChanged, isDockValid));
    DockLayout.stretchLastChildProperty = new dependencyObservable.Property("stretchLastChild", "DockLayout", new proxy.PropertyMetadata(true, AffectsLayout));
    return DockLayout;
})(layouts.LayoutBase);
exports.DockLayout = DockLayout;
