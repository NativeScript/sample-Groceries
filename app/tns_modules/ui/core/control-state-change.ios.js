var visualStateConstants = require("ui/styling/visual-state-constants");
var ObserverClass = NSObject.extend({
    observeValueForKeyPathOfObjectChangeContext: function (path, obj, change, context) {
        if (path === "selected") {
            this["_owner"]._onSelectedChanged();
        }
        else if (path === "enabled") {
            this["_owner"]._onEnabledChanged();
        }
        else if (path === "highlighted") {
            this["_owner"]._onHighlightedChanged();
        }
    }
}, {});
var ControlStateChangeListener = (function () {
    function ControlStateChangeListener(control, callback) {
        this._observer = ObserverClass.alloc();
        this._observer["_owner"] = this;
        this._control = control;
        this._callback = callback;
    }
    ControlStateChangeListener.prototype._onEnabledChanged = function () {
        this._updateState();
    };
    ControlStateChangeListener.prototype._onSelectedChanged = function () {
        this._updateState();
    };
    ControlStateChangeListener.prototype._onHighlightedChanged = function () {
        this._updateState();
    };
    ControlStateChangeListener.prototype._updateState = function () {
        var state = visualStateConstants.Normal;
        if (this._control.highlighted) {
            state = visualStateConstants.Pressed;
        }
        else if (this._control.highlighted) {
        }
        this._callback(state);
    };
    return ControlStateChangeListener;
})();
exports.ControlStateChangeListener = ControlStateChangeListener;
